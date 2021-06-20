package v1

import (
	bc "application/blockchain"
	"application/pkg/app"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type AccountIdBody struct {
	AccountId string `json:"accountId"`
}

type AccountRequestBody struct {
	Args []AccountIdBody `json:"args"`
}

type RegisterAccountRequestBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ChangeBalanceRequestBody struct {
	AccountId string  `json:"accountId"`
	Balance   float64 `json:"balance"`
}

// @Summary 获取账户信息
// @Param account body AccountRequestBody true "account"
// @Produce  json
// @Success 200 {object} app.Response
// @Failure 500 {object} app.Response
// @Router /api/v1/queryAccountList [post]
func QueryAccountList(c *gin.Context) {
	appG := app.Gin{C: c}
	body := new(AccountRequestBody)
	//解析Body参数
	if err := c.ShouldBind(body); err != nil {
		appG.Response(http.StatusBadRequest, "失败", fmt.Sprintf("参数出错%s", err.Error()))
		return
	}
	var bodyBytes [][]byte
	for _, val := range body.Args {
		bodyBytes = append(bodyBytes, []byte(val.AccountId))
	}
	//调用智能合约
	resp, err := bc.ChannelQuery("queryAccountList", bodyBytes)
	if err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	// 反序列化json
	var data []map[string]interface{}
	if err = json.Unmarshal(bytes.NewBuffer(resp.Payload).Bytes(), &data); err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	appG.Response(http.StatusOK, "成功", data)
}

func Register(c *gin.Context) {
	appG := app.Gin{C: c}
	body := new(RegisterAccountRequestBody)
	if err := c.ShouldBind(body); err != nil {
		appG.Response(http.StatusBadRequest, "失败", fmt.Sprintf("参数出错%s", err))
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	args := [][]byte{[]byte(body.Username), hash}
	resp, err := bc.ChannelExecute("addAccount", args)
	if err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	// 反序列化json
	var data map[string]interface{}
	if err = json.Unmarshal(bytes.NewBuffer(resp.Payload).Bytes(), &data); err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	appG.Response(http.StatusOK, "成功", data)
}

func Login(c *gin.Context) {
	appG := app.Gin{C: c}
	body := new(struct {
		Username string `json:"username"`
		Password string `json:"password"`
	})
	if err := c.ShouldBind(body); err != nil {
		appG.Response(http.StatusBadRequest, "失败", fmt.Sprintf("参数出错%s", err))
		return
	}
	resp, err := bc.ChannelQuery("queryAccountList", [][]byte{})
	if err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	var data []struct {
		AccountId string  `json:"accountId"` //账号ID
		UserName  string  `json:"userName"`  //账号名
		Password  string  `json:"password"`  // 密码
		Balance   float64 `json:"balance"`   //余额
	}
	if err = json.Unmarshal(bytes.NewBuffer(resp.Payload).Bytes(), &data); err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	for _, account := range data {
		if account.UserName == body.Username && bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(body.Password)) == nil {
			appG.Response(http.StatusOK, "成功", account)
			return
		}
	}
	appG.Response(http.StatusInternalServerError, "用户名或密码错误", nil)
}

func ChangeBalance(c *gin.Context) {
	appG := app.Gin{C: c}
	body := new(ChangeBalanceRequestBody)
	if err := c.ShouldBind(body); err != nil {
		appG.Response(http.StatusBadRequest, "失败", fmt.Sprintf("参数出错%s", err))
		return
	}
	args := [][]byte{}
	args = append(args, []byte(body.AccountId))
	args = append(args, []byte(fmt.Sprintf("%f", body.Balance)))
	resp, err := bc.ChannelExecute("updateBalance", args)
	if err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	// 反序列化json
	var data map[string]interface{}
	if err = json.Unmarshal(bytes.NewBuffer(resp.Payload).Bytes(), &data); err != nil {
		appG.Response(http.StatusInternalServerError, "失败", err.Error())
		return
	}
	appG.Response(http.StatusOK, "成功", data)

}
