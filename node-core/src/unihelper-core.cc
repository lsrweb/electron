#include <windows.h>
#include <napi.h>
#include <iostream>
#include <sstream>
#include <array>
#include <vector>

/**
 * 使用外部命令行获取最新的系统级别环境变量
 */
std::string getEnvVarFromCmd(const std::string &name)
{
    std::array<char, 128> buffer;
    std::string result;
    std::string command = "cmd /c echo %" + name + "%";

    // 打开管道执行命令行
    FILE *pipe = _popen(command.c_str(), "r");
    if (!pipe)
    {
        return "ERROR";
    }
    while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
    {
        result += buffer.data();
    }
    _pclose(pipe);

    // 去掉回车符
    result.erase(result.find_last_not_of("\r\n") + 1);

    return result;
}

/**
 * 打开资源管理器
 */
void openExplorer(const std::string &path)
{
    std::wstring wpath(path.begin(), path.end());
    std::wstring command = L"explorer " + wpath;
    _wsystem(command.c_str());
}

/**
 * 获取环境变量
 */
std::string getEnvVar(const std::string &name, const std::string &type)
{
    if (type == "system")
    {
        // 使用 cmd 获取最新的系统环境变量
        return getEnvVarFromCmd(name);
    }
    else
    {
        // 获取用户级别的环境变量
        wchar_t buffer[32767]; // Windows 环境变量的最大长度
        DWORD size = GetEnvironmentVariableW(std::wstring(name.begin(), name.end()).c_str(), buffer, sizeof(buffer));
        return size > 0 ? std::string(buffer, buffer + size) : "";
    }
}

/**
 * 设置环境变量
 */
void setEnvVar(const std::string &name, const std::string &value, const std::string &type)
{
    if (type == "system")
    {
        HKEY hKey;
        LONG result = RegOpenKeyExW(HKEY_LOCAL_MACHINE, L"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment", 0, KEY_SET_VALUE, &hKey);
        if (result == ERROR_SUCCESS)
        {
            std::wstring wname(name.begin(), name.end());
            std::wstring wvalue(value.begin(), value.end());
            RegSetValueExW(hKey, wname.c_str(), 0, REG_EXPAND_SZ, (const BYTE *)wvalue.c_str(), (wvalue.size() + 1) * sizeof(wchar_t));
            RegCloseKey(hKey);
        }
    }
    else
    {
        _wputenv_s(std::wstring(name.begin(), name.end()).c_str(), std::wstring(value.begin(), value.end()).c_str());
    }
}

/**
 * 打开资源管理器的 N-API 接口
 */
Napi::Value OpenExplorer(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string path = info[0].As<Napi::String>().Utf8Value();
    openExplorer(path);

    return Napi::String::New(env, "Explorer opened");
}

/**
 * 获取环境变量的 N-API 接口
 */
Napi::Value GetEnvVar(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string name = info[0].As<Napi::String>().Utf8Value();
    std::string type = "user";
    if (info.Length() > 1 && info[1].IsString())
    {
        type = info[1].As<Napi::String>().Utf8Value();
    }

    std::string value = getEnvVar(name, type);

    return Napi::String::New(env, value);
}

/**
 * 设置环境变量的 N-API 接口
 */
Napi::Value SetEnvVar(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString())
    {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string var = info[0].As<Napi::String>().Utf8Value();
    const std::string value = info[1].As<Napi::String>().Utf8Value();
    std::string type = "user";
    if (info.Length() > 2 && info[2].IsString())
    {
        type = info[2].As<Napi::String>().Utf8Value();
    }
    setEnvVar(var, value, type);

    return Napi::String::New(env, "Environment variable set");
}

/**
 * 获取 PATH 环境变量的 N-API 接口
 */
Napi::Value GetPathEnvVar(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    std::string type = "user";
    if (info.Length() > 0 && info[0].IsString())
    {
        type = info[0].As<Napi::String>().Utf8Value();
    }

    std::string path = getEnvVar("PATH", type);

    return Napi::String::New(env, path);
}

/**
 * 设置 PATH 环境变量的 N-API 接口
 * @param {string} value 要设置的路径
 * @param {boolean} overwrite 是否覆盖原有路径，默认为 false
 * @param {string} type 环境变量类型，可选值为 "user" 或 "system"，默认为 "user"
 */
Napi::Value SetPathEnvVar(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "need a string as the first argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string value = info[0].As<Napi::String>().Utf8Value();
    bool overwrite = false;
    if (info.Length() > 1 && info[1].IsBoolean())
    {
        overwrite = info[1].As<Napi::Boolean>().Value();
    }
    std::string type = "user";
    if (info.Length() > 2 && info[2].IsString())
    {
        type = info[2].As<Napi::String>().Utf8Value();
    }

    std::string path = getEnvVar("PATH", type);
    std::vector<std::string> paths;
    std::istringstream iss(path);
    std::string item;
    while (std::getline(iss, item, ';'))
    {
        paths.push_back(item);
    }

    if (overwrite)
    {
        paths.clear();
    }

    paths.push_back(value);
    std::ostringstream oss;
    for (size_t i = 0; i < paths.size(); i++)
    {
        if (i > 0)
        {
            oss << ";";
        }
        oss << paths[i];
    }
    setEnvVar("PATH", oss.str(), type);
    return Napi::String::New(env, "PATH environment variable set");
}


/**
 * 执行传入shell脚本的 N-API
 * @example
 */
Napi::Value ExecShell(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string shell = info[0].As<Napi::String>().Utf8Value();
    std::string result = "";
    std::array<char, 128> buffer;
    // 使用 "2>&1" 将标准错误流重定向到标准输出流
    FILE *pipe = _popen((shell + " 2>&1").c_str(), "r");

    if (!pipe)
    {
        return Napi::String::New(env, "ERROR");
    }
    while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
    {
        result += buffer.data();
    }
    _pclose(pipe);

    // 去掉结果中的换行符
    result.erase(std::remove(result.begin(), result.end(), '\n'), result.end());
    result.erase(std::remove(result.begin(), result.end(), '\r'), result.end());

    return Napi::String::New(env, result);
}

/**
 * 初始化模块
 */
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "openExplorer"), Napi::Function::New(env, OpenExplorer));
    exports.Set(Napi::String::New(env, "getEnvVar"), Napi::Function::New(env, GetEnvVar));
    exports.Set(Napi::String::New(env, "setEnvVar"), Napi::Function::New(env, SetEnvVar));
    exports.Set(Napi::String::New(env, "getPathEnvVar"), Napi::Function::New(env, GetPathEnvVar));
    exports.Set(Napi::String::New(env, "setPathEnvVar"), Napi::Function::New(env, SetPathEnvVar));
    exports.Set(Napi::String::New(env, "execShell"), Napi::Function::New(env, ExecShell));
    return exports;
}

NODE_API_MODULE(unihelper_core, Init)
