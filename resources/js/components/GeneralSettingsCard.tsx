import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { route } from 'ziggy-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Percent, Settings2, Info, CheckCircle2 } from 'lucide-react';

interface GeneralSettingsProps {
  settings: {
    enable_rebates: boolean;
    rebate_percentage: number;
    rebate_basis: string;
    rebate_min_days_early: number;
    rebate_apply_to_full_payoff: boolean;
    rebate_require_good_standing: boolean;
  };
}

export default function GeneralSettingsCard({ settings }: GeneralSettingsProps) {
  const { data, setData, post, processing, errors } = useForm({
    enable_rebates: settings.enable_rebates,
    rebate_percentage: settings.rebate_percentage,
    rebate_basis: settings.rebate_basis,
    rebate_min_days_early: settings.rebate_min_days_early,
    rebate_apply_to_full_payoff: settings.rebate_apply_to_full_payoff,
    rebate_require_good_standing: settings.rebate_require_good_standing,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('loan-settings.general.update'), {
      preserveScroll: true,
    });
  };

  return (
    <div className="mx-10 space-y-6 mb-10">
      <form onSubmit={submit} className="space-y-6">
        {/* Rebate Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Percent className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Loan Rebate Configuration</h2>
              <p className="text-sm text-gray-500">Configure how early payment rewards are calculated and applied.</p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Primary Toggle / Enable Button */}
            {!data.enable_rebates ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <Percent className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="max-w-sm">
                   <h3 className="text-lg font-bold text-gray-900">Rebate System is Currently Disabled</h3>
                   <p className="text-sm text-gray-600 mt-1">Enable this system to reward borrowers for early payments and automatically credit their next installment.</p>
                </div>
                <Button 
                  type="button" 
                  onClick={() => setData('enable_rebates', true)}
                  className="bg-[#FABF24] text-black hover:bg-[#E5AE1F] font-bold px-10 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Enable Rebate System
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1">
                  <Label className="text-base font-bold text-gray-900">Rebate System is Active</Label>
                  <p className="text-sm text-gray-600 max-w-md">
                    The system is currently rewarding borrowers for early payments. Use the settings below to fine-tune the behavior.
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setData('enable_rebates', false)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                >
                  Disable System
                </Button>
              </div>
            )}

            {/* Settings Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ${!data.enable_rebates ? 'hidden opacity-0' : 'opacity-100'}`}>
              <div className="space-y-3">
                <Label htmlFor="rebate_percentage" className="font-semibold">Rebate Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="rebate_percentage"
                    type="number"
                    step="0.01"
                    className="pl-9"
                    value={data.rebate_percentage}
                    onChange={(e) => setData('rebate_percentage', parseFloat(e.target.value) || 0)}
                  />
                  <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">The percentage of the basis amount given back.</p>
                {errors.rebate_percentage && <p className="text-xs text-red-500 font-medium">{errors.rebate_percentage}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="rebate_basis" className="font-semibold">Calculation Basis</Label>
                <Select
                  value={data.rebate_basis}
                  onValueChange={(value) => setData('rebate_basis', value)}
                >
                  <SelectTrigger id="rebate_basis">
                    <SelectValue placeholder="Select basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interest">Interest Amount Only</SelectItem>
                    <SelectItem value="principal">Principal Amount Only</SelectItem>
                    <SelectItem value="total">Total Installment Amount</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Which part of the payment the % is applied to.</p>
                {errors.rebate_basis && <p className="text-xs text-red-500 font-medium">{errors.rebate_basis}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="rebate_min_days_early" className="font-semibold">Min. Days Early</Label>
                <Input
                  id="rebate_min_days_early"
                  type="number"
                  value={data.rebate_min_days_early}
                  onChange={(e) => setData('rebate_min_days_early', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500">Minimum days before due date to qualify.</p>
                {errors.rebate_min_days_early && <p className="text-xs text-red-500 font-medium">{errors.rebate_min_days_early}</p>}
              </div>
            </div>

            {/* Logic Switches */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 transition-all duration-500 ${!data.enable_rebates ? 'hidden opacity-0' : 'opacity-100'}`}>
               <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-sm font-bold">Require Good Standing</Label>
                    <p className="text-xs text-gray-500">Disallow rebates if borrower has any other overdue installments.</p>
                  </div>
                  <Switch
                    checked={data.rebate_require_good_standing}
                    onCheckedChange={(checked) => setData('rebate_require_good_standing', checked)}
                  />
               </div>

               <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="mt-1">
                    <Settings2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-sm font-bold">Apply to Full Early Payoff</Label>
                    <p className="text-xs text-gray-500">Enable cumulative rebates when the borrower settles the entire loan today.</p>
                  </div>
                  <Switch
                    checked={data.rebate_apply_to_full_payoff}
                    onCheckedChange={(checked) => setData('rebate_apply_to_full_payoff', checked)}
                  />
               </div>
            </div>

            {/* Info Box */}
            {data.enable_rebates && (
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <Info className="w-5 h-5 shrink-0" />
                <p>
                  <strong>How it works:</strong> If a borrower pays an installment early, a rebate of 
                  <span className="font-bold"> {data.rebate_percentage}% </span> of the 
                  <span className="font-bold"> {data.rebate_basis} </span> will be calculated and automatically added to their 
                  <span className="font-bold"> next </span> scheduled payment as a credit.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
            <Button 
              type="submit" 
              className="bg-[#FABF24] text-black hover:bg-[#E5AE1F] font-bold px-8 shadow-sm transition-all active:scale-95" 
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save General Settings'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

