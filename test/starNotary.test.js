const StarNotary = artifacts.require("StarNotary");
console.clear();

contract('StarNotary', (accounts) => {
    let contract, result, starId = 1;
    const user1 = accounts[1],
          user2 = accounts[2],
          user3 = accounts[3],
          user4 = accounts[4],
          user5 = accounts[5];

    before(async () => {
        await StarNotary.new();
        contract = await StarNotary.deployed();
    })

    describe('Deployment', () => {
        it('Should deploy contract perfectly', async () => {
            result = contract.address;
            assert.notEqual(
                result, '0x0',
                'Deployment address contains 0x0'
            );
        })
        // Task
        it('Should return collection `name` as `Decentralize Starnotary App`', async () => {
            result = await contract.name()
            assert.equal(
                result, 'Decentralize Starnotary App',
                "Collection name is not `Decentralize Starnotary App`"
            );
        })

        // Task
        it('Should return collection `symbol` as `DSA`', async () => {
            result = await contract.symbol()
            assert.equal(
                result, 'DSA',
                "Collection symbol is not `DSA`"
            );
        })
    })
    // Task
    describe('Creating Stars', () => {
        it('Should create a new star from user1 by name `Awesome Star 1`', async () => {
            await contract.createStar('Awesome Star 1', starId, { from: user1 });
            result = await contract.lookUptokenIdToStarInfo(starId);
            starId += 1;
            assert.equal(
                result, 'Awesome Star 1',
                "Token1 Star name is not `Awesome Star 1`"
            )
        })

        it('Should create a new star from user2 by name `Awesome Star 2`', async () => {
            await contract.createStar('Awesome Star 2', starId, { from: user2 });
            result = await contract.lookUptokenIdToStarInfo(starId);
            starId += 1;
            assert.equal(
                result, 'Awesome Star 2',
                "Token2 Star name is not `Awesome Star 2`"
            )
        })

        it('Should create a new star from user3 by name `Awesome Star 3`', async () => {
            await contract.createStar('Awesome Star 3', starId, { from: user3 });
            result = await contract.lookUptokenIdToStarInfo(starId);
            starId += 1;
            assert.equal(
                result, 'Awesome Star 3',
                "Token3 Star name is not `Awesome Star 3`"
            )
        })

        it('Should create a new star from user4 by name `Awesome Star 4`', async () => {
            await contract.createStar('Awesome Star 4', starId, { from: user4 });
            result = await contract.lookUptokenIdToStarInfo(starId);
            starId += 1;
            assert.equal(
                result, 'Awesome Star 4',
                "Token4 Star name is not `Awesome Star 4`"
            )
        })
    })

    describe('Put for sale', () => {
        it('Should put user1 created star on sale', async () => {
            const starPrice = web3.utils.toWei('0.1', 'ether');
            await contract.putStarUpForSale(1, starPrice, { from: user1 });
            result = await contract.starsForSell(1);
            assert.equal(
                result, starPrice,
                "Star price is not same"
            )
        })
    })
    describe('Buying Stars', () => {
        let balanceOfUser1Before, balanceOfUser1After;

        it('Should buy star user2 from user1 and get the funds after the sale', async () => {
            const starPrice = web3.utils.toWei('0.1', 'ether');
            const value = web3.utils.toWei('0.5', 'ether');
            balanceOfUser1Before = await web3.eth.getBalance(user1);
            await contract.buyStar(1, { from: user2, value });
            balanceOfUser1After = await web3.eth.getBalance(user1);
            assert.equal(
                Number(balanceOfUser1Before) + Number(starPrice),
                Number(balanceOfUser1After), "Balance after sale is not right"
            )
        })

        it('Should return the user2 as current owner of `tokenId2`', async () => {
            result = await contract.ownerOf(1);
            assert.equal(
                result, user2,
                "Current tokenId1's owner is not account2"
            )
        })

        it('Should decrease user2 balance after buying Star', async () => {
            const starPrice = web3.utils.toWei('0.1', 'ether');
            result = Number(balanceOfUser1After) - Number(balanceOfUser1Before);
            assert.equal(
                result, starPrice,
                "User2 balance is not decreased after buying star"
            ) 
        })
    })

    // Taks
    describe('Exchange Stars', () => {
        it('Should exchange user2 star with user3', async () => {
            const user2Token = 2, user3Token = 3;
            await contract.approve(user3, user2Token, { from: user2 });
            await contract.approve(user2, user3Token, { from: user3 });
            await contract.exchangeStars(user2Token, user3Token, { from: user2 });
            result = await contract.ownerOf(user2Token);
            assert.equal(
                result, user3,
                "Current token2's owner is not account 3"
            )
            result = await contract.ownerOf(user3Token);
            assert.equal(
                result, user2,
                "Current token3's owner is not account 2"
            )
        })
    })

    // Task
    describe('Token transfer', () => {
        it('should transfer user4 token to user5', async () => {
            const user4Token = 4
            await contract.transferStar( user5, user4Token, { from: user4 })
            result = await contract.ownerOf(user4Token);
            assert.equal(
                result, user5,
                "User5 is not the owner after tranfer from user4"
            )
        })
    })
});