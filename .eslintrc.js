module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [ "warn", 2 ],
        "linebreak-style": [ "error", "unix" ],
        "quotes": [ "warn", "single" ],
        "semi": [ "warn", "never" ],
        "no-trailing-spaces": "warn",
        "no-unused-vars": "warn",
        "prefer-const": "warn",
        "no-var": "warn"
    }
};