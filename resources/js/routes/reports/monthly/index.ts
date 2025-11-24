import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\MCPRController::exportMethod
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/Reports/monthly/export-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportMethod
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportMethod.url = (options?: RouteQueryOptions) => {




    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportMethod
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportMethod
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportMethod
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportMethod.url(options),
    method: 'post',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\Reports\MCPRController::print
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
export const print = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: print.url(options),
    method: 'post',
})

print.definition = {
    methods: ["post"],
    url: '/Reports/monthly/print',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\MCPRController::print
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
print.url = (options?: RouteQueryOptions) => {




    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\MCPRController::print
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
print.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: print.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::print
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: print.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::print
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
printForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: print.url(options),
    method: 'post',
})

print.form = printForm



const monthly = {
    export: Object.assign(exportMethod, exportMethod),
    print: Object.assign(print, print),
}

export default monthly