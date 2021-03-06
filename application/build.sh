#!/bin/bash

echo "运行单元测试，检查区块链网络是否连接成功，需要有go环境，若无可忽略"
go test sdk_test.go
echo "开始准备启动应用"
sleep 2

echo "一、清理环境、删除旧容器"
rm -rf app
docker rm -f blockchain-real-estate-application


echo "二、开始打包编译"
docker build -f  Dockerfile -t blockchain-real-estate-application:v1 .

echo "三、运行编译容器"
docker run -it -d --name blockchain-real-estate-application blockchain-real-estate-application:v1

echo "四、拷贝容器中编译后的二进制可执行文件"
docker cp blockchain-real-estate-application:/root/application/app ./