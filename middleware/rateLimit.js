const rateLimit = (maxAttempts, windowMs) => {
    const attempts = new Map();

    return (req, res, next) => {
        const ip = req.ip;

        if (!attempts.has(ip)) {
            attempts.set(ip, { count: 1, firstAttempt: Date.now() });
        } else {
            const attemptData = attempts.get(ip);
            const timeSinceFirstAttempt = Date.now() - attemptData.firstAttempt;

            if (timeSinceFirstAttempt > windowMs) {
                attempts.set(ip, { count: 1, firstAttempt: Date.now() });
            } else {
                attemptData.count += 1;
                if (attemptData.count > maxAttempts) {
                    return res.status(429).json({
                        statusCode: 429,
                        message: 'Too many attempts. Please try again later.'
                    });
                }
                attempts.set(ip, attemptData);
            }
        }

        next();
    };
};

module.exports = rateLimit;
