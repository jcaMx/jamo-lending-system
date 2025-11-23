import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\DCPRController::exportMethod
 * @see app/Http/Controllers/Reports/DCPRController.php:11
 * @route '/Reports/dcpr/export-pdf'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/Reports/dcpr/export-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportMethod
 * @see app/Http/Controllers/Reports/DCPRController.php:11
 * @route '/Reports/dcpr/export-pdf'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportMethod
 * @see app/Http/Controllers/Reports/DCPRController.php:11
 * @route '/Reports/dcpr/export-pdf'
 */
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reports\DCPRController::exportMethod
 * @see app/Http/Controllers/Reports/DCPRController.php:11
 * @route '/Reports/dcpr/export-pdf'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: exportMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reports\DCPRController::exportMethod
 * @see app/Http/Controllers/Reports/DCPRController.php:11
 * @route '/Reports/dcpr/export-pdf'
 */
        exportMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: exportMethod.url(options),
            method: 'post',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Reports\DCPRController::print
 * @see app/Http/Controllers/Reports/DCPRController.php:22
 * @route '/Reports/dcpr/print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: print.url(options),
    method: 'post',
})

print.definition = {
    methods: ["post"],
    url: '/Reports/dcpr/print',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\DCPRController::print
 * @see app/Http/Controllers/Reports/DCPRController.php:22
 * @route '/Reports/dcpr/print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DCPRController::print
 * @see app/Http/Controllers/Reports/DCPRController.php:22
 * @route '/Reports/dcpr/print'
 */
print.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: print.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reports\DCPRController::print
 * @see app/Http/Controllers/Reports/DCPRController.php:22
 * @route '/Reports/dcpr/print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: print.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reports\DCPRController::print
 * @see app/Http/Controllers/Reports/DCPRController.php:22
 * @route '/Reports/dcpr/print'
 */
        printForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: print.url(options),
            method: 'post',
        })
    
    print.form = printForm
const dcpr = {
    export: Object.assign(exportMethod, exportMethod),
print: Object.assign(print, print),
}

export default dcpr