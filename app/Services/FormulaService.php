<?php

namespace App\Services;

use App\Models\Formula;
use RunTimeException;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;

class FormulaService
{
    protected ExpressionLanguage $expressionLanguage;

    public function __construct()
    {
        $this->expressionLanguage = new ExpressionLanguage;
    }

    public function evaluate(Formula $formula, array $inputs): float
    {
        // Decode variable names
        $requiredVars = json_decode($formula->variables, true);

        foreach ($requiredVars as $var) {
            if (! array_key_exists($var, $inputs)) {
                throw new RuntimeException("Missing variable: {$var}");
            }
        }

        // replace ^ with ** for power
        $expression = str_replace('^', '**', $formula->expression);

        try {
            $result = $this->expressionLanguage->evaluate($expression, $inputs);

            return (float) $result;
        } catch (\Throwable $e) {
            throw new RuntimeException("Error evaluating formula '{$formula->name}': ".$e->getMessage());
        }

    }
}
