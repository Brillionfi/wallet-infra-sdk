### ITransaction Model

The ITransaction model represents a transaction and includes various properties that define its characteristics. This document provides an in-depth explanation of the ITransaction model.

1.  `transactionType`

    - Type: TransactionTypeKeys enum ['signed', 'unsigned']
    - Description: The type of the transaction that is required to publish

2.  `transactionId`

    - Type: string
    - Description: The unique identifier of the transaction.

3.  `transactionHash`

    - Type: string
    - Description: The hash of the transaction. This is optional.

4.  `signedTx`

        - Type: string
        - Description: The signed transaction data. This is optional.

5.  `from`

        - Type: string
        - Description: The sender address of the transaction.

6.  `to`

        - Type: string
        - Description: The receiver address of the transaction.

7.  `value`

    - Type: number
    - Description: The value of the transaction.

8.  `gasLimit`

    - Type: number
    - Description: The gas limit for the transaction.

9.  `maxFeePerGas`

    - Type: number
    - Description: The maximum fee per gas unit for the transaction.

10. `maxPriorityFeePerGas`

    - Type: number
    - Description: The maximum priority fee per gas unit for the transaction.

11. `nonce`

    - Type: number
    - Description: The nonce for the transaction.

12. `data`

    - Type: string
    - Description: The data payload of the transaction.

13. `chainId`

    - Type: ChainIdSchema
    - Description: The chain ID on which the transaction is executed.

14. `status`

    - Type: TransactionStatusKeys enum [`queued`,`pending`, `success`, `failed`, `canceled` ]
    - Description: The status of publishing a transaction

15. `createdAt`

    - Type: string
    - Description: The timestamp when the transaction was created.

16. `updatedAt`

    - Type: string
    - Description: The timestamp when the transaction was last updated.

17. `updatedBy`

    - Type: string
    - Description: The identifier of the entity that last updated the transaction.
