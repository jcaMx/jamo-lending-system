import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
<<<<<<< HEAD
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:31
 * @route '/Loans/loans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/Loans/loans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:31
 * @route '/Loans/loans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:31
 * @route '/Loans/loans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:31
 * @route '/Loans/loans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:31
 * @route '/Loans/loans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/Loans/loans/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoanController::show
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/loans/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\LoanController::index
 * @see app/Http/Controllers/LoanController.php:18
=======
* @see \App\Http\Controllers\LoanController::index
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/Loans/Loans/VLA',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoanController::index
<<<<<<< HEAD
 * @see app/Http/Controllers/LoanController.php:18
=======
 * @see app/Http/Controllers/LoanController.php:29
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/Loans/Loans/VLA'
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
<<<<<<< HEAD
const LoanController = { store, show, index }
=======
/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:44
 * @route '/Loans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/Loans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:44
 * @route '/Loans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:44
 * @route '/Loans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:44
 * @route '/Loans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:44
 * @route '/Loans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/approve/{loan}'
 */
export const approve = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/Loans/approve/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/approve/{loan}'
 */
approve.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return approve.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/approve/{loan}'
 */
approve.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/approve/{loan}'
 */
    const approveForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/approve/{loan}'
 */
        approveForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/reject/{loan}'
 */
export const reject = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/Loans/reject/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/reject/{loan}'
 */
reject.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return reject.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/reject/{loan}'
 */
reject.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/reject/{loan}'
 */
    const rejectForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/reject/{loan}'
 */
        rejectForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/close/{loan}'
 */
export const close = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/Loans/close/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/close/{loan}'
 */
close.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return close.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/close/{loan}'
 */
close.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/close/{loan}'
 */
    const closeForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/close/{loan}'
 */
        closeForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const LoanController = { index, store, approve, reject, close }
>>>>>>> f527e644e77be1939726e62492d52074749b459a

export default LoanController