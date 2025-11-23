import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:63
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
 * @see routes/web.php:63
 * @route '/Loans/1MLL'
 */
oneMonthLate.url = (options?: RouteQueryOptions) => {
    return oneMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:63
 * @route '/Loans/1MLL'
 */
oneMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oneMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:63
 * @route '/Loans/1MLL'
 */
oneMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oneMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:63
 * @route '/Loans/1MLL'
 */
    const oneMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: oneMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:63
 * @route '/Loans/1MLL'
 */
        oneMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oneMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:63
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
 * @see routes/web.php:64
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
 * @see routes/web.php:64
 * @route '/Loans/3MLL'
 */
threeMonthLate.url = (options?: RouteQueryOptions) => {
    return threeMonthLate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:64
 * @route '/Loans/3MLL'
 */
threeMonthLate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: threeMonthLate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:64
 * @route '/Loans/3MLL'
 */
threeMonthLate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: threeMonthLate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:64
 * @route '/Loans/3MLL'
 */
    const threeMonthLateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: threeMonthLate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:64
 * @route '/Loans/3MLL'
 */
        threeMonthLateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: threeMonthLate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:64
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
 * @see routes/web.php:65
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
 * @see routes/web.php:65
 * @route '/Loans/PMD'
 */
pastMaturityDate.url = (options?: RouteQueryOptions) => {
    return pastMaturityDate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:65
 * @route '/Loans/PMD'
 */
pastMaturityDate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pastMaturityDate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:65
 * @route '/Loans/PMD'
 */
pastMaturityDate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pastMaturityDate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:65
 * @route '/Loans/PMD'
 */
    const pastMaturityDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pastMaturityDate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:65
 * @route '/Loans/PMD'
 */
        pastMaturityDateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pastMaturityDate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:65
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
 * @see routes/web.php:66
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
 * @see routes/web.php:66
 * @route '/Loans/VLA'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:66
 * @route '/Loans/VLA'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:66
 * @route '/Loans/VLA'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:66
 * @route '/Loans/VLA'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:66
 * @route '/Loans/VLA'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:66
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
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/Loans/VAL',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:67
 * @route '/Loans/VAL'
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
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
export const addLoan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addLoan.url(options),
    method: 'get',
})

addLoan.definition = {
    methods: ["get","head"],
    url: '/Loans/AddLoan',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
addLoan.url = (options?: RouteQueryOptions) => {
    return addLoan.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
addLoan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addLoan.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
addLoan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addLoan.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
    const addLoanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: addLoan.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
        addLoanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: addLoan.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:70
 * @route '/Loans/AddLoan'
 */
        addLoanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: addLoan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    addLoan.form = addLoanForm
const loans = {
    oneMonthLate: Object.assign(oneMonthLate, oneMonthLate),
threeMonthLate: Object.assign(threeMonthLate, threeMonthLate),
pastMaturityDate: Object.assign(pastMaturityDate, pastMaturityDate),
applications: Object.assign(applications, applications),
view: Object.assign(view, view),
addLoan: Object.assign(addLoan, addLoan),
}

export default loans