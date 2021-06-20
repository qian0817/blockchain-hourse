import React, {useState} from "react";
import {login, register, Response} from "../../api";
import {Button, Form, Input, message, Tabs} from "antd";
import {useHistory} from "react-router";
import {AxiosError} from "axios";

const {TabPane} = Tabs;

const layout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22},
};

const Login = () => {
    const history = useHistory();
    const [loginLoading, setLoginLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)

    const handleRegister = (values: any) => {
        setRegisterLoading(true)
        register(values.username, values.password)
            .then((account) => history.push(`/${account.data.data.accountId}`))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
            .finally(() => setRegisterLoading(false))
    }

    const handleLogin = (values: any) => {
        setLoginLoading(true)
        login(values.username, values.password)
            .then(account => account.data.data)
            .then(account => {
                if (account.userName === 'admin') {
                    history.push('/admin')
                } else {
                    history.push(`/${account.accountId}`)
                }
            })
            .catch(ex => {
                message.warn((ex as AxiosError<Response<any>>).response?.data.msg)
            })
            .finally(() => setLoginLoading(false))
    }

    return (
        <div style={{
            width: 800,
            height: 600,
            position: 'absolute',
            margin: "auto",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }}>
            <h1 style={{textAlign:"center"}}>基于区块链的房地产交易系统</h1>
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="登录" key="1">
                    <Form onFinish={handleLogin}>
                        <Form.Item
                            {...layout}
                            label="用户名"
                            name="username"
                            rules={[{required: true, message: "请输入用户名"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            {...layout}
                            label="密码"
                            name="password"
                            rules={[{required: true, message: "请输入密码"}]}>
                            <Input type="password"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loginLoading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="注册" key="2">
                    <Form onFinish={handleRegister}  {...layout}>
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{required: true, message: "请输入用户名"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: "请输入密码"}]}>
                            <Input type="password"/>
                        </Form.Item>
                        <Form.Item labelCol={{span: 0}} wrapperCol={{span: 24}}>
                            <Button
                                type="primary" htmlType="submit" block loading={registerLoading}>
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    )
}
export default Login