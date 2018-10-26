type Lazy<T> = {
    lazy: true,
    url: string,
    interface: T
}

interface Local {
    a: string,
    b: string,
    c: string
}

export interface Schema {
    /** The name of languages */
    lang: {
        en: string,
        es: string
    }
    preset: 'awesome' | 'bad' | 'cool',
    local: Lazy<Local>
}