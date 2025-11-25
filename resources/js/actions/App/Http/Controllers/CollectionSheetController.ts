import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/daily-collections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CollectionSheetController::index
 * @see app/Http/Controllers/CollectionSheetController.php:10
 * @route '/daily-collections'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const CollectionSheetController = { index }

export default CollectionSheetController