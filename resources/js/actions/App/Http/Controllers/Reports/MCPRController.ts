import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\MCPRController::exportPdf
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportPdf.url(options),
    method: 'post',
})

exportPdf.definition = {
    methods: ["post"],
    url: '/Reports/monthly/export-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportPdf
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportPdf.url = (options?: RouteQueryOptions) => {




    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportPdf
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportPdf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportPdf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportPdf
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportPdf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::exportPdf
* @see app/Http/Controllers/Reports/MCPRController.php:11
* @route '/Reports/monthly/export-pdf'
*/
exportPdfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: exportPdf.url(options),
    method: 'post',
})

exportPdf.form = exportPdfForm

/**
* @see \App\Http\Controllers\Reports\MCPRController::printPreview
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
export const printPreview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printPreview.url(options),
    method: 'post',
})

printPreview.definition = {
    methods: ["post"],
    url: '/Reports/monthly/print',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reports\MCPRController::printPreview
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
printPreview.url = (options?: RouteQueryOptions) => {




    return printPreview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\MCPRController::printPreview
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
printPreview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printPreview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::printPreview
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
const printPreviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: printPreview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Reports\MCPRController::printPreview
* @see app/Http/Controllers/Reports/MCPRController.php:22
* @route '/Reports/monthly/print'
*/
printPreviewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: printPreview.url(options),
    method: 'post',
})

printPreview.form = printPreviewForm

const MCPRController = { exportPdf, printPreview }

export default MCPRController