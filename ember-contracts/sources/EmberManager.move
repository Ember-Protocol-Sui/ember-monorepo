module ember_manager::EmberManager {

    use sui::object;
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::table;
    use sui::coin;
    use sui::balance::{Self, Balance};
    use std::option;
    use std::vector;
    use sui::sui::SUI;
    use sui::coin::{Coin};
    use std::hash;
    /// -------------------------------
    /// Main shared manager object
    /// -------------------------------
    public struct EmberManager has key {
        id: UID,
        loans: table::Table<u64, Loan>,
        next_id: u64,
        balance: Balance<SUI>,
    }

    public entry fun create_manager(ctx: &mut TxContext) {
        let manager = EmberManager {
            id: object::new(ctx),
            loans: table::new<u64, Loan>(ctx),
            next_id: 0,
            balance: balance::zero<SUI>()
        };

        transfer::share_object(manager);
    }


    /// -------------------------------
    /// Loan stored in table
    /// -------------------------------
    public struct Loan has store {
        amount: u64,
        ltv: u8,
        borrower: address,
        lender: option::Option<address>,
        time: u64,
        htlc_address: vector<u8>,
        state: u8, // 0 = pending, 1 = fulfilled, 2 = released
        hash_secrets_borrower: vector<vector<u8>>,
        hash_secrets_lender: vector<vector<u8>>,
        hashLoanActiveSecret: vector<u8>,
        hashLoanRepaymentSecret: vector<u8>
    }

    /// -------------------------------
    /// Create Loan
    /// -------------------------------
    public fun create_loan(
        manager: &mut EmberManager,
        borrower: address,
        amount: u64,
        ltv: u8,
        time: u64,
        hash_secrets_borrower: vector<vector<u8>>,
        hashLoanActiveSecret: vector<u8>,
        hashLoanRepaymentSecret: vector<u8>,
    ): u64 {
        assert!(vector::length(&hash_secrets_borrower) == 14, 1);

        let loan_id = manager.next_id;
        manager.next_id = loan_id + 1;

        let loan = Loan {
            amount,
            ltv,
            borrower,
            lender: option::none(),
            time,
            htlc_address: vector::empty(),
            state: 0,
            hash_secrets_borrower,
            hash_secrets_lender: vector::empty(),
            hashLoanActiveSecret,
            hashLoanRepaymentSecret
        };

        table::add(&mut manager.loans, loan_id, loan);
        loan_id
    }

    /// -------------------------------
    /// Fulfill Loan → escrow funds in contract
    /// -------------------------------
    public fun fulfill_loan(
        manager: &mut EmberManager,
        loan_id: u64,
        lender: address,
        hash_secrets_lender: vector<vector<u8>>,
        coin: Coin<SUI>
    ) {
        assert!(vector::length(&hash_secrets_lender) == 14, 2);
        assert!(table::contains(&manager.loans, loan_id), 3);

        let loan = table::borrow_mut(&mut manager.loans, loan_id);
        assert!(loan.state == 0, 4);

        let value = coin::value<SUI>(&coin);

        loan.lender = option::some(lender);
        loan.hash_secrets_lender = hash_secrets_lender;
        loan.state = 1;
        coin::put<SUI>(&mut manager.balance, coin);
    }

    /// -------------------------------
    /// Release escrow to borrower
    /// (Call after HTLC / secret validation)
    /// -------------------------------
    public fun release_to_borrower<T>(
        manager: &mut EmberManager,
        loan_id: u64,
        ctx: &mut TxContext,
        secret: vector<u8>
    ) {
        let loan = table::borrow_mut(&mut manager.loans, loan_id);
        assert!(loan.state == 1, 100);

        let computed_hash = hash::sha2_256(secret);

        assert!(
            computed_hash == loan.hashLoanActiveSecret,
            0 // invalid secret
        );

        let amount = loan.amount;

        // Withdraw exact amount from contract vault
        let payout: Coin<SUI> = coin::take<SUI>(
            &mut manager.balance,
            amount,
            ctx
        );


        // Transfer to borrower
        transfer::public_transfer(payout, loan.borrower);

        loan.state = 2;
    }

    /// -------------------------------
    /// Internal borrow helper
    /// -------------------------------
    fun borrow_loan(manager: &EmberManager, loan_id: u64): &Loan {
        assert!(table::contains(&manager.loans, loan_id), 10);
        table::borrow(&manager.loans, loan_id)
    }

    /// -------------------------------
    /// Getters
    /// -------------------------------
    public fun get_amount(manager: &EmberManager, loan_id: u64): u64 {
        borrow_loan(manager, loan_id).amount
    }

    public fun get_ltv(manager: &EmberManager, loan_id: u64): u8 {
        borrow_loan(manager, loan_id).ltv
    }

    public fun get_state(manager: &EmberManager, loan_id: u64): u8 {
        borrow_loan(manager, loan_id).state
    }

    public fun get_borrower(manager: &EmberManager, loan_id: u64): address {
        borrow_loan(manager, loan_id).borrower
    }

    public fun get_hash_secrets_borrower(
        manager: &EmberManager,
        loan_id: u64
    ): &vector<vector<u8>> {
        &borrow_loan(manager, loan_id).hash_secrets_borrower
    }

    public fun get_hash_secrets_lender(
        manager: &EmberManager,
        loan_id: u64
    ): &vector<vector<u8>> {
        &borrow_loan(manager, loan_id).hash_secrets_lender
    }

    public fun get_loan_active_secret(
        manager: &EmberManager,
        loan_id: u64
    ): &vector<u8> {
        &borrow_loan(manager, loan_id).hashLoanActiveSecret
    }

    public fun get_loan_repayment_secret(
        manager: &EmberManager,
        loan_id: u64
    ): &vector<u8> {
        &borrow_loan(manager, loan_id).hashLoanRepaymentSecret
    }
}
