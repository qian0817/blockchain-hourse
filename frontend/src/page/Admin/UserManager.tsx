import React, {useEffect, useState} from "react";
import {Account, changeBalance, createRealEstate, queryAccountList, Response} from "../../api";
import {Button, Form, Input, InputNumber, message, Modal, Table, Upload} from "antd";
import {AxiosError} from "axios";
import {RcFile} from "antd/es/upload";
import {UploadOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {spawn} from "child_process";

const UserManager = () => {
    const [accountList, setAccountList] = useState<Account[]>([]);
    const adminAccount = accountList.find(it => it.userName === 'admin')
    const [addRealEstateForm] = Form.useForm();
    const [changeBalanceForm] = Form.useForm();
    const [addRealEstateModalVisible, setAddRealEstateModalVisible] = useState(false);
    const [changeBalanceModalVisible, setChangeBalanceModalVisible] = useState(false);
    const [currentAccountId, setCurrentAccountId] = useState('')
    const [photoList, setPhotoList] = useState<string[]>([])

    useEffect(() => {
        queryAccountList()
            .then(accountList => setAccountList(accountList.data.data))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
    }, [])

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const handleAddRealEstate = async () => {
        addRealEstateForm
            .validateFields()
            .then(values => {
                createRealEstate(adminAccount!!.accountId, values.totalArea, currentAccountId, values.place, values.roomType, photoList)
                    .then(() => setAddRealEstateModalVisible(false))
                    .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
            })
    }

    const handleChangeBalance = () => {

        changeBalanceForm
            .validateFields()
            .then((values) => {
                changeBalance(currentAccountId, values.balance)
                    .then(() => setChangeBalanceModalVisible(false))
                    .then(() => queryAccountList().then(accountList => setAccountList(accountList.data.data)))
                    .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
            })
    }

    const columns = [
        {
            title: "??????id",
            dataIndex: 'accountId',
            key: 'accountId'
        },
        {
            title: "?????????",
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title: "??????",
            dataIndex: 'balance',
            key: 'balance'
        },
        {
            title: "??????",
            dataIndex: 'accountId',
            key: 'accountId',
            render: (accountId: string,account:Account) => {
                return (
                    <>
                        <Button onClick={() => {
                            setCurrentAccountId(accountId)
                            changeBalanceForm.setFieldsValue({balance:account.balance})
                            setChangeBalanceModalVisible(true)
                        }}>????????????</Button>
                        <Button style={{marginLeft:8}} onClick={() => {
                            setCurrentAccountId(accountId)
                            setAddRealEstateModalVisible(true)
                        }}>????????????</Button>
                    </>
                )
            }
        }
    ]

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    return (
        <>
            <Table columns={columns} dataSource={accountList.filter(it => it.userName !== 'admin')}/>
            <Modal
                visible={addRealEstateModalVisible}
                onOk={handleAddRealEstate}
                onCancel={() => setAddRealEstateModalVisible(false)}>
                <Form form={addRealEstateForm} {...layout}>
                    <Form.Item
                        label="?????????"
                        name="totalArea"
                        rules={[{required: true, message: '??????????????????'}]}>
                        <InputNumber min={0} precision={2} step={0.01}/>
                    </Form.Item>
                    <Form.Item
                        label="??????"
                        name="place"
                        rules={[{required: true, message: '???????????????'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="??????"
                        name="roomType"
                        rules={[{required: true, message: '???????????????'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="??????"
                        name="photos"
                        rules={[{required: true, message: '???????????????'}]}>
                            <Upload
                                listType="picture"
                                onRemove={async (file) => {
                                    const photoEncoding = await getBase64(file.originFileObj!!);
                                    setPhotoList(photoList => {
                                        const index = photoList.indexOf(photoEncoding)
                                        const newFileList = photoList.slice();
                                        newFileList.splice(index, 1);
                                        return newFileList
                                    })
                                }}
                                beforeUpload={async (file) => {
                                    const photoEncoding = await getBase64(file);
                                    setPhotoList(photoList => [...photoList, photoEncoding])
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined/>}>????????????</Button>
                            </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={changeBalanceModalVisible}
                onOk={handleChangeBalance}
                onCancel={() => setChangeBalanceModalVisible(false)}
            >
                <Form form={changeBalanceForm}>
                    <Form.Item
                        label="??????"
                        name="balance"
                        rules={[{required: true, message: '???????????????'}]}>
                        <InputNumber min={0} precision={2} step={10000} style={{width:200}}/>
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default UserManager;