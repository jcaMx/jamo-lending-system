<?php

namespace Tests\Unit;

use App\Models\LoanProduct;
use App\Models\LoanProductRule;
use App\Services\RuleEvaluatorService;
use Illuminate\Support\Collection;
use PHPUnit\Framework\TestCase;

class RuleEvaluatorServiceTest extends TestCase
{
    public function test_personal_loan_collateral_rule_is_true_when_above_income_multiplier(): void
    {
        $product = $this->makeProductWithRules([
            [
                'rule_type' => 'collateral',
                'condition_key' => 'monthly_income',
                'operator' => '>',
                'condition_value' => 5,
            ],
        ]);

        $service = new RuleEvaluatorService();
        $result = $service->evaluate($product, null, [
            'loan_amount' => 50001,
            'monthly_income' => 10000,
        ]);

        $this->assertTrue($result['collateral']);
        $this->assertFalse($result['coborrower']);
    }

    public function test_personal_loan_collateral_rule_is_false_when_at_threshold(): void
    {
        $product = $this->makeProductWithRules([
            [
                'rule_type' => 'collateral',
                'condition_key' => 'monthly_income',
                'operator' => '>',
                'condition_value' => 5,
            ],
        ]);

        $service = new RuleEvaluatorService();
        $result = $service->evaluate($product, null, [
            'loan_amount' => 50000,
            'monthly_income' => 10000,
        ]);

        $this->assertFalse($result['collateral']);
        $this->assertFalse($result['coborrower']);
    }

    public function test_personal_loan_coborrower_rule_is_true_when_dti_exceeds_40_percent(): void
    {
        $product = $this->makeProductWithRules([
            [
                'rule_type' => 'coborrower',
                'condition_key' => 'dti_ratio',
                'operator' => '>',
                'condition_value' => 40,
            ],
        ]);

        $service = new RuleEvaluatorService();
        $result = $service->evaluate($product, null, [
            'loan_amount' => 100000,
            'monthly_income' => 20000,
            'dti_ratio' => 41,
        ]);

        $this->assertFalse($result['collateral']);
        $this->assertTrue($result['coborrower']);
    }

    public function test_business_loan_rules_evaluate_independently(): void
    {
        $product = $this->makeProductWithRules([
            [
                'rule_type' => 'collateral',
                'condition_key' => 'monthly_income',
                'operator' => '>',
                'condition_value' => 6,
            ],
            [
                'rule_type' => 'coborrower',
                'condition_key' => 'dti_ratio',
                'operator' => '>',
                'condition_value' => 35,
            ],
        ]);

        $service = new RuleEvaluatorService();
        $result = $service->evaluate($product, null, [
            'loan_amount' => 70000, // 70000 > (10000 * 6)
            'monthly_income' => 10000,
            'dti_ratio' => 30, // below 35
        ]);

        $this->assertTrue($result['collateral']);
        $this->assertFalse($result['coborrower']);
    }

    public function test_dti_is_computed_from_loan_amount_term_and_income_when_not_provided(): void
    {
        $product = $this->makeProductWithRules([
            [
                'rule_type' => 'coborrower',
                'condition_key' => 'dti_ratio',
                'operator' => '>',
                'condition_value' => 40,
            ],
        ]);

        $service = new RuleEvaluatorService();
        $result = $service->evaluate($product, null, [
            'loan_amount' => 120000,
            'term' => 12, // monthly obligation = 10000
            'monthly_income' => 20000, // DTI = 50%
        ]);

        $this->assertTrue($result['coborrower']);
    }

    /**
     * @param  array<int, array<string, mixed>>  $rules
     */
    private function makeProductWithRules(array $rules): LoanProduct
    {
        $product = new LoanProduct();
        $product->setAttribute('id', 1);
        $product->setAttribute('name', 'Test Product');

        $ruleModels = array_map(
            static fn (array $row) => new LoanProductRule($row),
            $rules
        );

        $product->setRelation('rules', new Collection($ruleModels));

        return $product;
    }
}
