### IToken Model

The IToken model represents a token and includes various properties that define its characteristics. This document provides an in-depth explanation of the IToken model.

1. `chainId`

   - Type: ChainIdSchema
   - Description: The chain ID on which the token is deployed.

2. `tokenId`

   - Type: string
   - Description: The unique identifier of the token.

3. `status`

   - Type: TokenStatusKeys enum ['Active', 'Inactive']
   - Description: The status of the token.

4. `name`

   - Type: string
   - Description: The name of the token.

5. `address`

   - Type: string
   - Description: The address of the token contract.

6. `type`

   - Type: TokenTypeKeys enum ['Native', 'ERC20', 'ERC721', 'ERC1155']
   - Description: The type of the token.

7. `logo`

   - Type: string
   - Description: The logo of the token.

8. `decimals`

   - Type: number (optional)
   - Description: The number of decimals the token uses. This is optional.

9. `symbol`

   - Type: string (optional)
   - Description: The symbol of the token. This is optional.

10. `contractABI`

    - Type: string
    - Description: The ABI (Application Binary Interface) of the token contract.

11. `createdAt`

    - Type: string
    - Description: The timestamp when the token was created.

12. `updatedAt`

    - Type: string
    - Description: The timestamp when the token was last updated.

13. `updatedBy`

    - Type: string
    - Description: The identifier of the entity that last updated the token.
