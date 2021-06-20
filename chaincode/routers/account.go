package routers

import (
	"chaincode/lib"
	"chaincode/utils"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"strconv"
	"time"
)

// QueryAccountList 查询账户列表
func QueryAccountList(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var accountList []lib.Account
	results, err := utils.GetStateByPartialCompositeKeys(stub, lib.AccountKey, args)
	if err != nil {
		return shim.Error(fmt.Sprintf("%s", err))
	}
	for _, v := range results {
		if v != nil {
			var account lib.Account
			err := json.Unmarshal(v, &account)
			if err != nil {
				return shim.Error(fmt.Sprintf("QueryAccountList-反序列化出错: %s", err))
			}
			accountList = append(accountList, account)
		}
	}
	accountListByte, err := json.Marshal(accountList)
	if err != nil {
		return shim.Error(fmt.Sprintf("QueryAccountList-序列化出错: %s", err))
	}
	return shim.Success(accountListByte)
}

func AddAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// TODO 相同名称检验
	if len(args) != 2 {
		return shim.Error("参数长度错误")
	}
	accountId := strconv.FormatInt(time.Now().Unix(), 10)
	account := &lib.Account{
		AccountId: accountId,
		UserName:  args[0],
		Password:  args[1],
		Balance:   0,
	}
	if account.UserName == "" || account.Password == "" {
		return shim.Error("用户名或密码不能为空")
	}
	if err := utils.WriteLedger(account, stub, lib.AccountKey, []string{accountId}); err != nil {
		return shim.Error(fmt.Sprintf("%s", err))
	}
	//将成功创建的信息返回
	accountByte, err := json.Marshal(account)
	if err != nil {
		return shim.Error(fmt.Sprintf("序列化成功创建的信息出错: %s", err))
	}
	return shim.Success(accountByte)
}

func UpdateBalance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	accountId := args[0]
	balance, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error(fmt.Sprintf("%s 不是符合标准的金额", args[1]))
	}
	results, err := utils.GetStateByPartialCompositeKeys(stub, lib.AccountKey, []string{accountId})
	if err != nil || results == nil || len(results) != 1 {
		return shim.Error("不存在指定的账户")
	}
	var account lib.Account
	err = json.Unmarshal(results[0], &account)
	if err != nil {
		return shim.Error(fmt.Sprintf("反序列化出错: %s", err))
	}
	account.Balance = balance
	if err := utils.WriteLedger(account, stub, lib.AccountKey, []string{accountId}); err != nil {
		return shim.Error(fmt.Sprintf("%s", err))
	}
	//将成功创建的信息返回
	accountByte, err := json.Marshal(account)
	if err != nil {
		return shim.Error(fmt.Sprintf("序列化成功创建的信息出错: %s", err))
	}
	return shim.Success(accountByte)
}
