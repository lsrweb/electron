#include <napi.h>
#include <windows.h>

void openExplorer(const std::string& path) {
    std::string command = "explorer " + path;
    system(command.c_str());
}

Napi::Value OpenExplorer(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string path = info[0].As<Napi::String>().Utf8Value();
    openExplorer(path);

    return Napi::String::New(env, "Explorer opened");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "openExplorer"), Napi::Function::New(env, OpenExplorer));
    return exports;
}

NODE_API_MODULE(addon, Init)