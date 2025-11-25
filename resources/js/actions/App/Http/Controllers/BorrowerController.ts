import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/borrowers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::index
 * @see app/Http/Controllers/BorrowerController.php:12
 * @route '/borrowers'
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
/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/borrowers/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::add
 * @see app/Http/Controllers/BorrowerController.php:56
 * @route '/borrowers/add'
 */
        addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    add.form = addForm
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
const showf9ea18a5a6015c22611b808a1e6e1d96 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'get',
})

showf9ea18a5a6015c22611b808a1e6e1d96.definition = {
    methods: ["get","head"],
    url: '/borrowers/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return showf9ea18a5a6015c22611b808a1e6e1d96.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
showf9ea18a5a6015c22611b808a1e6e1d96.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
    const showf9ea18a5a6015c22611b808a1e6e1d96Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
        showf9ea18a5a6015c22611b808a1e6e1d96Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}'
 */
        showf9ea18a5a6015c22611b808a1e6e1d96Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf9ea18a5a6015c22611b808a1e6e1d96.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showf9ea18a5a6015c22611b808a1e6e1d96.form = showf9ea18a5a6015c22611b808a1e6e1d96Form
    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
const showf4255c517210f69c61390f9d8a9e848d = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'get',
})

showf4255c517210f69c61390f9d8a9e848d.definition = {
    methods: ["get","head"],
    url: '/borrowers/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return showf4255c517210f69c61390f9d8a9e848d.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
showf4255c517210f69c61390f9d8a9e848d.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
    const showf4255c517210f69c61390f9d8a9e848dForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
        showf4255c517210f69c61390f9d8a9e848dForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf4255c517210f69c61390f9d8a9e848d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BorrowerController::show
 * @see app/Http/Controllers/BorrowerController.php:35
 * @route '/borrowers/{id}/edit'
 */
        showf4255c517210f69c61390f9d8a9e848dForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showf4255c517210f69c61390f9d8a9e848d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showf4255c517210f69c61390f9d8a9e848d.form = showf4255c517210f69c61390f9d8a9e848dForm

export const show = {
    '/borrowers/{id}': showf9ea18a5a6015c22611b808a1e6e1d96,
    '/borrowers/{id}/edit': showf4255c517210f69c61390f9d8a9e848d,
}

const BorrowerController = { index, add, show }

export default BorrowerController