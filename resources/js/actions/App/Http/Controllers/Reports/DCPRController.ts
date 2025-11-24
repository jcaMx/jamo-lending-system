import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\DCPRController::exportPdf
* @see app/Http/Controllers/Reports/DCPRController.php:11
* @route '/Reports/dcpr/export-pdf'
*/
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportPdf.url(options),
    method: 'post',
})

exportPdf.definition = {
    methods: ["post"],
    url: '/Reports/dcpr/export-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportPdf
* @see app/Http/Controllers/Reports/DCPRController.php:11
* @route '/Reports/dcpr/export-pdf'
*/
exportPdf.url = (options?: RouteQueryOptions) => {




    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportPdf
* @see app/Http/Controllers/Reports/DCPRController.php:11
* @route '/Reports/dcpr/export-pdf'
*/
exportPdf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportPdf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportPdf
* @see app/Http/Controllers/Reports/DCPRController.php:11
* @route '/Reports/dcpr/export-pdf'
*/
const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportPdf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\DCPRController::exportPdf
* @see app/Http/Controllers/Reports/DCPRController.php:11
* @route '/Reports/dcpr/export-pdf'
*/
exportPdfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportPdf.url(options),
    method: 'post',
})

exportPdf.form = exportPdfForm

/**
* @see \App\Http\Controllers\Reports\DCPRController::printPreview
* @see app/Http/Controllers/Reports/DCPRController.php:22
* @route '/Reports/dcpr/print'
*/
export const printPreview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printPreview.url(options),
    method: 'post',
})

printPreview.definition = {
    methods: ["post"],
    url: '/Reports/dcpr/print',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\DCPRController::printPreview
* @see app/Http/Controllers/Reports/DCPRController.php:22
* @route '/Reports/dcpr/print'
*/
printPreview.url = (options?: RouteQueryOptions) => {




    return printPreview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DCPRController::printPreview
* @see app/Http/Controllers/Reports/DCPRController.php:22
* @route '/Reports/dcpr/print'
*/
printPreview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printPreview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\DCPRController::printPreview
* @see app/Http/Controllers/Reports/DCPRController.php:22
* @route '/Reports/dcpr/print'
*/
const printPreviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: printPreview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\DCPRController::printPreview
* @see app/Http/Controllers/Reports/DCPRController.php:22
* @route '/Reports/dcpr/print'
*/
printPreviewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: printPreview.url(options),
    method: 'post',
})

printPreview.form = printPreviewForm

const DCPRController = { exportPdf, printPreview }

export default DCPRController