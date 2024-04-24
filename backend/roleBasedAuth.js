export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin' || req.user.role === 'staff') return next()
    // we want admin only authorization failure to be hidden,
    // it will prevent potential hackers from knowing such page exists.
    next('route')
}

export const usersOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') return next()
    // we want admin only authorization failure to be hidden,
    // it will prevent potential hackers from knowing such page exists.
    res.redirect(303, '/unauthorized');
}