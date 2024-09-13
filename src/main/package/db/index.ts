import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs";

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
      DB_PATH = path.join(path.dirname(app.getPath("exe")), "/config/config.db");
    }
    this.db = new sqlite3.Database(DB_PATH, (err: { message: string }) => {
      if (err) {
        console.error("连接数据库错误：" + err.message);
      } else {
        console.log("连接数据库成功");
      }
    });
    this.query = "";
    this.params = [];
  }

  createTable(table: string, columns: { [key: string]: string }): ORM {
    const columnsDef = Object.entries(columns)
      .map(([column, type]) => `${column} ${type}`)
      .join(", ");
    this.query = `CREATE TABLE IF NOT EXISTS ${table} (${columnsDef})`;
    this.params = [];
    return this;
  }

  insert(table: string, data: object): ORM {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);
    this.query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    this.params = values;
    return this;
  }

  delete(table: string, condition: string, params: any[]): ORM {
    this.query = `DELETE FROM ${table} WHERE ${condition}`;
    this.params = params;
    return this;
  }

  update(table: string, data: object, condition: string, params: any[]): ORM {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);
    this.query = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    this.params = [...values, ...params];
    return this;
  }

  select(table: string, columns: string[] = ["*"], condition = "", params: any[] = []): ORM {
    const columnsStr = columns.join(", ");
    this.query = `SELECT ${columnsStr} FROM ${table}`;
    if (condition) {
      this.query += ` WHERE ${condition}`;
    }
    this.params = params;
    return this;
  }

  execute(callback: (err: Error | null, result?: any) => void): void {
    if (this.query.startsWith("SELECT")) {
      this.db.all(this.query, this.params, callback);
    } else {
      this.db.run(this.query, this.params, function (err: Error | null) {
        callback(err, this);
      });
    }
  }
}

export default ORM;
