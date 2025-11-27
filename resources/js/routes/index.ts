import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
<<<<<<< HEAD
 * @see routes/web.php:35
=======
 * @see routes/web.php:31
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
<<<<<<< HEAD
 * @see routes/web.php:39
=======
 * @see routes/web.php:35
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
<<<<<<< HEAD
 * @see routes/web.php:28
=======
 * @see routes/web.php:24
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apply.url(options),
    method: 'get',
})

apply.definition = {
    methods: ["get","head"],
    url: '/applynow',
} satisfies RouteDefinition<["get","head"]>

/**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
apply.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apply.url(options),
    method: 'get',
})
/**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
apply.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apply.url(options),
    method: 'head',
})

    /**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
    const applyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apply.url(options),
        method: 'get',
    })

            /**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
        applyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apply.url(options),
            method: 'get',
        })
            /**
<<<<<<< HEAD
 * @see routes/web.php:30
 * @route '/applynow'
=======
 * @see routes/web.php:26
 * @route '/apply'
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 */
        applyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apply.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apply.form = applyForm
/**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
<<<<<<< HEAD
 * @see routes/web.php:52
=======
 * @see routes/web.php:48
>>>>>>> f527e644e77be1939726e62492d52074749b459a
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
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
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
 * @route '/daily-collections'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
 * @route '/daily-collections'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
 * @route '/daily-collections'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
 * @route '/daily-collections'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
 * @route '/daily-collections'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DailyCollectionController::index
 * @see app/Http/Controllers/DailyCollectionController.php:13
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