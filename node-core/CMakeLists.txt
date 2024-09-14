cmake_minimum_required(VERSION 3.29)
project(node_core)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)
include_directories(build)
include_directories(node_modules)
include_directories(node_modules/node-addon-api)
include_directories(src)

add_executable(node_core
    build/node_modules/node-addon-api/Release/obj/nothing/node_modules/node-addon-api/nothing.obj
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/CL.command.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/Cl.items.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/CL.read.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/CL.write.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/Lib-link.read.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/Lib-link.write.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/Lib.command.1.tlog
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.tlog/nothing.lastbuildstate
    build/node_modules/node-addon-api/Release/obj/nothing/nothing.lib.recipe
    build/node_modules/node-addon-api/Release/obj/nothing/win_delay_load_hook.obj
    build/node_modules/node-addon-api/node_api.sln
    build/node_modules/node-addon-api/nothing.vcxproj
    build/node_modules/node-addon-api/nothing.vcxproj.filters
    build/Release/obj/openExplorer/openExplorer.tlog/CL.command.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/Cl.items.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/CL.read.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/CL.write.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/link.command.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/link.read.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/link.secondary.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/link.write.1.tlog
    build/Release/obj/openExplorer/openExplorer.tlog/openExplorer.lastbuildstate
    build/Release/obj/openExplorer/src/openExplorer.obj
    build/Release/obj/openExplorer/openExplorer.node.recipe
    build/Release/obj/openExplorer/win_delay_load_hook.obj
    build/Release/nothing.lib
    build/Release/openExplorer.exp
    build/Release/openExplorer.iobj
    build/Release/openExplorer.ipdb
    build/Release/openExplorer.lib
    build/Release/openExplorer.node
    build/Release/openExplorer.pdb
    build/binding.sln
    build/config.gypi
    build/openExplorer.vcxproj
    build/openExplorer.vcxproj.filters
    node_modules/node-addon-api/napi-inl.deprecated.h
    node_modules/node-addon-api/napi-inl.h
    node_modules/node-addon-api/napi.h
    node_modules/node-addon-api/nothing.c
    src/openExplorer.cc)
