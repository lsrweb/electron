#include <napi.h>
#include <windows.h>



void openExplorer(const std::string& path) {
    std::string command = "explorer " + path;
    system(command.c_str());
}

std::string getEnvVar(const std::string& var) {
    char* val = getenv(var.c_str());
    return val == NULL ? std::string("") : std::string(val);
}

void setEnvVar(const std::string& var, const std::string& value) {
    SetEnvironmentVariable(var.c_str(), value.c_str());
    SendMessageTimeout(HWND_BROADCAST, WM_SETTINGCHANGE, 0, (LPARAM)L"Environment", SMTO_ABORTIFHUNG, 5000, NULL);
}

Napi::Value OpenExplorer(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string path = info[0].As<Napi::String>().Utf8Value();
    openExplorer(path);

    return Napi::String::New(env, "Explorer opened");
}

Napi::Value GetEnvVar(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string var = info[0].As<Napi::String>().Utf8Value();
    std::string value = getEnvVar(var);

    return Napi::String::New(env, value);
}

Napi::Value SetEnvVar(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string var = info[0].As<Napi::String>().Utf8Value();
    const std::string value = info[1].As<Napi::String>().Utf8Value();
    setEnvVar(var, value);

    return Napi::String::New(env, "Environment variable set");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "openExplorer"), Napi::Function::New(env, OpenExplorer));
    exports.Set(Napi::String::New(env, "getEnvVar"), Napi::Function::New(env, GetEnvVar));
    exports.Set(Napi::String::New(env, "setEnvVar"), Napi::Function::New(env, SetEnvVar));
    return exports;
}

NODE_API_MODULE(openExplorer, Init)