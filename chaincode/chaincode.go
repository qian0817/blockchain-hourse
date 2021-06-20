package main

import (
	"chaincode/lib"
	"chaincode/routers"
	"chaincode/utils"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"time"
)

type BlockChainRealEstate struct {
}

// Init 链码初始化
func (t *BlockChainRealEstate) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("链码初始化")
	timeLocal, err := time.LoadLocation("Asia/Chongqing")
	if err != nil {
		return shim.Error(fmt.Sprintf("时区设置失败%s", err))
	}
	time.Local = timeLocal
	//初始化账号数据
	account := &lib.Account{
		AccountId: "0",
		UserName:  "admin",
		Password:  "$2a$10$pCuhIbsqcS4x6uDU3mCTVOW2WzvvHLXSkqeCqxqUudHYJM8pMx4mi",
		Balance:   0,
	}
	// 写入账本
	if err := utils.WriteLedger(account, stub, lib.AccountKey, []string{"0"}); err != nil {
		return shim.Error(fmt.Sprintf("%s", err))
	}
	return shim.Success(nil)
}

// Invoke 实现Invoke接口调用智能合约
func (t *BlockChainRealEstate) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	funcName, args := stub.GetFunctionAndParameters()
	switch funcName {
	case "addAccount":
		return routers.AddAccount(stub, args)
	case "updateBalance":
		return routers.UpdateBalance(stub, args)
	case "queryAccountList":
		return routers.QueryAccountList(stub, args)
	case "createRealEstate":
		return routers.CreateRealEstate(stub, args)
	case "queryRealEstateList":
		return routers.QueryRealEstateList(stub, args)
	case "createSelling":
		return routers.CreateSelling(stub, args)
	case "createSellingByBuy":
		return routers.CreateSellingByBuy(stub, args)
	case "querySellingList":
		return routers.QuerySellingList(stub, args)
	case "querySellingListByBuyer":
		return routers.QuerySellingListByBuyer(stub, args)
	case "updateSelling":
		return routers.UpdateSelling(stub, args)
	default:
		return shim.Error(fmt.Sprintf("没有该功能: %s", funcName))
	}
}

func main() {
	err := shim.Start(new(BlockChainRealEstate))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
