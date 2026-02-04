#[test_only]
module ember_manager::EmberManager_tests {

    use ember_manager::EmberManager;
    use sui::test_scenario;
    use std::vector;

    /// Helper: create 14 dummy secrets
    fun secrets14(): vector<vector<u8>> {
        let mut v = vector::empty<vector<u8>>();
        let mut i = 0;
        while (i < 14) {
            vector::push_back(&mut v, vector::empty<u8>());
            i = i + 1;
        };
        v
    }

    /// Helper: dummy bytes
    fun dummy_bytes(): vector<u8> {
        vector::empty<u8>()
    }

    /// -------------------------------
    /// Test: create loan
    /// -------------------------------
    #[test]
    fun test_create_loan_with_secrets() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize manager (test-only wrapper)
        EmberManager::init_for_tests(ctx);

        let mut manager =
            test_scenario::take_shared<EmberManager::EmberManager>(&scenario);

        let borrower = @0xB;

        let loan_id = EmberManager::create_loan(
            &mut manager,
            borrower,
            1_000,
            50,
            100,
            secrets14(),
            dummy_bytes(),
            dummy_bytes(),
        );

        assert!(loan_id == 0, 101);
        assert!(manager.next_id == 1, 102);

        // Validate getters
        assert!(EmberManager::get_amount(&manager, loan_id) == 1_000, 103);
        assert!(EmberManager::get_ltv(&manager, loan_id) == 50, 104);
        assert!(EmberManager::get_state(&manager, loan_id) == 0, 105);
        assert!(EmberManager::get_borrower(&manager, loan_id) == borrower, 106);

        // Validate new secrets
        assert!(vector::length(
            EmberManager::get_loan_active_secret(&manager, loan_id)
        ) == 0, 107);

        assert!(vector::length(
            EmberManager::get_loan_repayment_secret(&manager, loan_id)
        ) == 0, 108);

        test_scenario::return_shared(manager);
        test_scenario::end(scenario);
    }

    /// -------------------------------
    /// Test: fulfill loan
    /// -------------------------------
    #[test]
    fun test_fulfill_loan() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);

        EmberManager::init_for_tests(ctx);
        let mut manager =
            test_scenario::take_shared<EmberManager::EmberManager>(&scenario);

        let loan_id = EmberManager::create_loan(
            &mut manager,
            @0xB,
            2_000,
            60,
            200,
            secrets14(),
            dummy_bytes(),
            dummy_bytes(),
        );

        EmberManager::fulfill_loan(
            &mut manager,
            loan_id,
            @0xC,
            secrets14(),
        );

        assert!(EmberManager::get_state(&manager, loan_id) == 1, 107);

        let lender_secrets =
            EmberManager::get_hash_secrets_lender(&manager, loan_id);
        assert!(vector::length(lender_secrets) == 14, 108);

        test_scenario::return_shared(manager);
        test_scenario::end(scenario);
    }

    /// -------------------------------
    /// Test: cannot fulfill twice
    /// -------------------------------
    #[test]
    #[expected_failure]
    fun test_double_fulfill_fails() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);

        EmberManager::init_for_tests(ctx);
        let mut manager =
            test_scenario::take_shared<EmberManager::EmberManager>(&scenario);

        let loan_id = EmberManager::create_loan(
            &mut manager,
            @0xB,
            500,
            40,
            50,
            secrets14(),
            dummy_bytes(),
            dummy_bytes(),
        );

        EmberManager::fulfill_loan(
            &mut manager,
            loan_id,
            @0xC,
            secrets14(),
        );

        // Should abort (state != 0)
        EmberManager::fulfill_loan(
            &mut manager,
            loan_id,
            @0xD,
            secrets14(),
        );

        test_scenario::end(scenario);
    }

    /// -------------------------------
    /// Test: invalid secret length
    /// -------------------------------
    #[test]
    #[expected_failure]
    fun test_invalid_secret_length_fails() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);

        EmberManager::init_for_tests(ctx);
        let mut manager =
            test_scenario::take_shared<EmberManager::EmberManager>(&scenario);

        let bad_secrets = vector::empty<vector<u8>>();

        EmberManager::create_loan(
            &mut manager,
            @0xB,
            100,
            30,
            10,
            bad_secrets,
            dummy_bytes(),
            dummy_bytes(),
        );

        test_scenario::end(scenario);
    }
}
