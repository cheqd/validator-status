package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/hasura/go-graphql-client"
)

const signedBlocksWindow int = 17280

type Validator struct {
	Validator []struct {
		SigningInfos []struct {
			MissedBlocksCounter graphql.Int     `graphql:"missed_blocks_counter"`
			Tombstoned          graphql.Boolean `graphql:"tombstoned"`
		} `graphql:"validator_signing_infos"`
		ValidatorInfo struct {
			OperatorAddress graphql.String `graphql:"operator_address"`
		} `graphql:"validator_info"`
		ValidatorDescriptions []struct {
			Moniker graphql.String `graphql:"moniker"`
		} `graphql:"validator_descriptions"`
		ValidatorStatuses []struct {
			Jailed graphql.Boolean `graphql:"jailed"`
			Height graphql.Int     `graphql:"height"`
			Status graphql.Int     `graphql:"status"`
		} `graphql:"validator_statuses"`
	} `graphql:"validator"`
	// The following code doesn't work. In particular, signed_blocks_window cannot be unmarshalled
	// to Params, although the Parameters struct should be able to hold it. For now, since the value
	// is a static parameter, and most likely will stay that way, we will use a const in its stead.

	// SlashingParams []struct {
	// 	Params Parameters `graphql:"params"`
	// } `graphql:"slashing_params"`
}

func getValidatorData() Validator {
	var validator Validator
	client := graphql.NewClient(os.Getenv("GRAPHQL_ENDPOINT"), &http.Client{})

	err := client.Query(context.Background(), &validator, nil)
	if err != nil {
		fmt.Println(err)
	}
	return validator
}

func printValidatorDetails(validator Validator) {
	fmt.Println("Query started.")

	for i := range validator.Validator {
		var missedBlocks graphql.Int
		var jailed graphql.Boolean
		var height graphql.Int
		var status graphql.Int

		name := validator.Validator[i].ValidatorDescriptions[0].Moniker

		if len(validator.Validator[i].SigningInfos) != 0 {
			missedBlocks = validator.Validator[i].SigningInfos[0].MissedBlocksCounter
		} else {
			missedBlocks = 100000
		}

		if len(validator.Validator[i].ValidatorStatuses) != 0 {
			jailed = validator.Validator[i].ValidatorStatuses[0].Jailed
			height = validator.Validator[i].ValidatorStatuses[0].Height
			status = validator.Validator[i].ValidatorStatuses[0].Status
		} else {
			jailed = true
			height = -100000
			status = 1
		}

		health := (1 - (missedBlocks / graphql.Int(signedBlocksWindow))) * 100
		if (health < 0) || (jailed == true) {
			health = 0
		}

		fmt.Println("====================================================================================================================")
		fmt.Printf("%v) Validator: %v\t Health: %v\t Jailed: %v\t Height: %v\t Status: %v\n\n ", i+1, name, health, jailed, height, status)
	}
	fmt.Println("Query ended.")
}

func heartBeat() {
	for range time.Tick(time.Second * 90) {
		printValidatorDetails(getValidatorData())
	}
}

func main() {

	heartBeat()

}
