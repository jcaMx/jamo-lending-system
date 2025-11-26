import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
export const oneMonthLate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oneMonthLate.url(options),
    method: 'get',
})

oneMonthLate.definition = {
    methods: ["get","head"],
    url: '/Loans/1MLL',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
oneMonthLate.url = (options?: RouteQueryOptions) => {
    return oneMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
oneMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oneMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
oneMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oneMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
    const oneMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: oneMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
        oneMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oneMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:66
 * @route '/Loans/1MLL'
 */
        oneMonthLateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oneMonthLate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    oneMonthLate.form = oneMonthLateForm
/**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
export const threeMonthLate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: threeMonthLate.url(options),
    method: 'get',
})

threeMonthLate.definition = {
    methods: ["get","head"],
    url: '/Loans/3MLL',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
threeMonthLate.url = (options?: RouteQueryOptions) => {
    return threeMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
threeMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: threeMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
threeMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: threeMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
    const threeMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: threeMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
        threeMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: threeMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:68
 * @route '/Loans/3MLL'
 */
        threeMonthLateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: threeMonthLate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    threeMonthLate.form = threeMonthLateForm
/**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
export const pastMaturityDate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pastMaturityDate.url(options),
    method: 'get',
})

pastMaturityDate.definition = {
    methods: ["get","head"],
    url: '/Loans/PMD',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
pastMaturityDate.url = (options?: RouteQueryOptions) => {
    return pastMaturityDate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
pastMaturityDate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pastMaturityDate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
pastMaturityDate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pastMaturityDate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
    const pastMaturityDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pastMaturityDate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
        pastMaturityDateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pastMaturityDate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:70
 * @route '/Loans/PMD'
 */
        pastMaturityDateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pastMaturityDate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pastMaturityDate.form = pastMaturityDateForm
/**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
export const applications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})

applications.definition = {
    methods: ["get","head"],
    url: '/Loans/VLA',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:72
 * @route '/Loans/VLA'
 */
        applicationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    applications.form = applicationsForm
/**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/Loans/Loans/VLA',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoanController::view
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans/Loans/VLA'
 */
        viewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:0
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
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/Loans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/Loans/AddLoan',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:80
 * @route '/Loans/AddLoan'
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
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:42
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
 * @see app/Http/Controllers/LoanController.php:42
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
 * @see app/Http/Controllers/LoanController.php:42
 * @route '/Loans/approve/{loan}'
 */
approve.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:42
 * @route '/Loans/approve/{loan}'
 */
    const approveForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:42
 * @route '/Loans/approve/{loan}'
 */
        approveForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:51
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
 * @see app/Http/Controllers/LoanController.php:51
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
 * @see app/Http/Controllers/LoanController.php:51
 * @route '/Loans/reject/{loan}'
 */
reject.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:51
 * @route '/Loans/reject/{loan}'
 */
    const rejectForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:51
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
const loans = {
    oneMonthLate: Object.assign(oneMonthLate, oneMonthLate),
threeMonthLate: Object.assign(threeMonthLate, threeMonthLate),
pastMaturityDate: Object.assign(pastMaturityDate, pastMaturityDate),
applications: Object.assign(applications, applications),
view: Object.assign(view, view),
store: Object.assign(store, store),
add: Object.assign(add, add),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
close: Object.assign(close, close),
}

export default loans