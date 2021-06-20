package main_test

import (
	"application/blockchain"
	"fmt"
	"testing"
)

func TestInvoke_QueryAccountList(t *testing.T) {
	blockchain.Init()
	response, e := blockchain.ChannelQuery("queryAccountList", [][]byte{})
	if e != nil {
		fmt.Println(e.Error())
		t.FailNow()
	}
	fmt.Println(string(response.Payload))
}
