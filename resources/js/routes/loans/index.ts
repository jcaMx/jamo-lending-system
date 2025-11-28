import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/loans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
export const oneMonthLate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oneMonthLate.url(options),
    method: 'get',
})

oneMonthLate.definition = {
    methods: ["get","head"],
    url: '/loans/1mll',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
oneMonthLate.url = (options?: RouteQueryOptions) => {
    return oneMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
oneMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oneMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
oneMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oneMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
    const oneMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: oneMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:76
 * @route '/loans/1mll'
 */
        oneMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oneMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:76
 * @route '/loans/1mll'
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
 * @see routes/web.php:78
 * @route '/loans/val'
 */
export const viewAllLoans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewAllLoans.url(options),
    method: 'get',
})

viewAllLoans.definition = {
    methods: ["get","head"],
    url: '/loans/val',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
viewAllLoans.url = (options?: RouteQueryOptions) => {
    return viewAllLoans.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
viewAllLoans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewAllLoans.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
viewAllLoans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewAllLoans.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
    const viewAllLoansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: viewAllLoans.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
        viewAllLoansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewAllLoans.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:78
 * @route '/loans/val'
 */
        viewAllLoansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewAllLoans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    viewAllLoans.form = viewAllLoansForm
/**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
export const threeMonthLate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: threeMonthLate.url(options),
    method: 'get',
})

threeMonthLate.definition = {
    methods: ["get","head"],
    url: '/loans/3mll',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
threeMonthLate.url = (options?: RouteQueryOptions) => {
    return threeMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
threeMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: threeMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
threeMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: threeMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
    const threeMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: threeMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:80
 * @route '/loans/3mll'
 */
        threeMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: threeMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:80
 * @route '/loans/3mll'
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
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
export const pastMaturityDate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pastMaturityDate.url(options),
    method: 'get',
})

pastMaturityDate.definition = {
    methods: ["get","head"],
    url: '/loans/pmd',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
pastMaturityDate.url = (options?: RouteQueryOptions) => {
    return pastMaturityDate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
pastMaturityDate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pastMaturityDate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
pastMaturityDate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pastMaturityDate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
    const pastMaturityDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pastMaturityDate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:82
 * @route '/loans/pmd'
 */
        pastMaturityDateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pastMaturityDate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:82
 * @route '/loans/pmd'
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
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
export const applications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})

applications.definition = {
    methods: ["get","head"],
    url: '/loans/vla',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:85
 * @route '/loans/vla'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:85
 * @route '/loans/vla'
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
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/loans/addloan',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:87
 * @route '/loans/addloan'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:87
 * @route '/loans/addloan'
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
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
export const approve = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/loans/approve/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
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
 * @route '/loans/approve/{loan}'
 */
approve.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
    const approveForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
        approveForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
export const reject = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/loans/reject/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
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
 * @route '/loans/reject/{loan}'
 */
reject.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
    const rejectForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
        rejectForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
export const close = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/loans/close/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
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
 * @route '/loans/close/{loan}'
 */
close.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
    const closeForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
        closeForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const loans = {
    store: Object.assign(store, store),
oneMonthLate: Object.assign(oneMonthLate, oneMonthLate),
viewAllLoans: Object.assign(viewAllLoans, viewAllLoans),
threeMonthLate: Object.assign(threeMonthLate, threeMonthLate),
pastMaturityDate: Object.assign(pastMaturityDate, pastMaturityDate),
applications: Object.assign(applications, applications),
add: Object.assign(add, add),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
close: Object.assign(close, close),
}

export default loans