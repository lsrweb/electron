import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs";

/**
 * 使用文档
 *
 * 该 ORM 类提供了一个简单的接口来与 SQLite 数据库进行交互。以下是如何使用该类的一些示例。
 *
 * 初始化 ORM 实例：
 *
 * ```typescript
 * import ORM from './index';
 *
 * const orm = new ORM();
 * ```
 *
 * 创建表：
 *
 * ```typescript
 * orm.createTable('users', {
 *   id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
 *   name: 'TEXT',
 *   email: 'TEXT'
 * }).execute((err) => {
 *   if (err) {
 *     console.error('创建表失败', err);
 *   } else {
 *     console.log('创建表成功');
 *   }
 * });
 * ```
 *
 * 插入数据：
 *
 * ```typescript
 * orm.insert('users', {
 *   name: 'John Doe',
 *   email: 'john.doe@example.com'
 * }).execute((err) => {
 *   if (err) {
 *     console.error('插入数据失败', err);
 *   } else {
 *     console.log('插入数据成功');
 *   }
 * });
 * ```
 *
 * 更新数据：
 *
 * ```typescript
 * orm.update('users', { name: 'Jane Doe' }, 'id = ?', [1]).execute((err) => {
 *   if (err) {
 *     console.error('更新数据失败', err);
 *   } else {
 *     console.log('更新数据成功');
 *   }
 * });
 * ```
 *
 * 删除数据：
 *
 * ```typescript
 * orm.delete('users', 'id = ?', [1]).execute((err) => {
 *   if (err) {
 *     console.error('删除数据失败', err);
 *   } else {
 *     console.log('删除数据成功');
 *   }
 * });
 * ```
 *
 * 查询数据：
 *
 * ```typescript
 * orm.select('users', ['id', 'name', 'email']).execute((err, rows) => {
 *   if (err) {
 *     console.error('查询数据失败', err);
 *   } else {
 *     console.log('查询数据成功', rows);
 *   }
 * });
 * ```
 */
class ORM {
  private db: sqlite3.Database;
  private query: string;
  private params: any[];

  constructor() {
    // 初始化目录判断
    const configDir = path.join(app.getAppPath(), "/config");
    if (!existsSync(configDir)) {
      mkdirSync(configDir);
    }

    let DB_PATH = path.join(app.getAppPath(), "/config/config.db");
    if (app.isPackaged) {
      DB_PATH = path.join(
        path.dirname(app.getPath("exe")),
        "/config/config.db"
      );
    }
    this.db = new sqlite3.Database(DB_PATH, (err: { message: string }) => {
      if (err) {
        console.error("connect db error", err.message);
      } else {
        console.log("connect db success");
      }
    });
    this.query = "";
    this.params = [];
  }

  private autoExecute(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.query.startsWith("SELECT")) {
        this.db.all(this.query, this.params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        this.db.run(this.query, this.params, function (err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  private async executeQuery(): Promise<any> {
    const result = await this.autoExecute();
    this.query = "";
    this.params = [];
    return result;
  }

  async createTable(
    table: string,
    columns: { [key: string]: string }
  ): Promise<any> {
    const columnsDef = Object.entries(columns)
      .map(([column, type]) => `${column} ${type}`)
      .join(",");
    this.query = `CREATE TABLE IF NOT EXISTS ${table} (${columnsDef})`;
    this.params = [];
    return this.executeQuery();
  }

  async insert(table: string, data: object): Promise<any> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);
    this.query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    this.params = values;
    return this.executeQuery();
  }

  async delete(table: string, condition: string, params: any[]): Promise<any> {
    this.query = `DELETE FROM ${table} WHERE ${condition}`;
    this.params = params;
    return this.executeQuery();
  }

  async update(
    table: string,
    data: object,
    condition: string,
    params?: any[]
  ): Promise<any> {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);
    this.query = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    this.params = [...values, ...params];
    return this.executeQuery();
  }

  async select(
    table: string,
    condition = "",
    params: any[] = [],
    columns: string[] = ["*"]
  ): Promise<any> {
    const columnsStr = columns.join(", ");
    this.query = `SELECT ${columnsStr} FROM ${table}`;
    if (condition) {
      this.query += ` WHERE ${condition}`;
    }
    this.params = params;
    return this.executeQuery();
  }

  async selectOne(
    table: string,
    condition = "",
    params: any[] = [],
    columns: string[] = ["*"]
  ): Promise<any> {
    const result = await this.select(table, condition, params, columns);
    return result[0];
  }

  // 判断是否存在某个表
  async hasTable(table: string): Promise<boolean> {
    this.query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`;
    this.params = [];
    const result = await this.executeQuery();
    return result.length > 0;
  }

  async dropTable(table: string): Promise<any> {
    this.query = `DROP TABLE ${table}`;
    this.params = [];
    return this.executeQuery();
  }

  // 判断是否第一次初始化
  async isFirstInit(): Promise<boolean> {
    const result = await this.hasTable("system");
    return !result;
  }
}

export default ORM;
