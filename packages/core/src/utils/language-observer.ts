export interface LanguageObserverInit {
    /** An array of specific phrases to be monitored. */
    phraseFilter?: string[];
    /** An array of specific locales to be monitored. If this property isn't included, changes to all locales cause notifications. No default value. */
    localeFilter?: string[];
    oldValue?: boolean;
}

export interface LanguageRecord {
    type: string;
    value: string;
    oldValue?: string;
    phraseName?: string;
}

export class LanguageObserver {

    private previous: LanguageRecord[] = [];
    private onChange: any;
    private phraseFilter: string[] = null;
    private localeFilter: string[] = null;
    private oldValue: boolean = false;

    /** Creates and returns a new LanguageObserver which will invoke a specified callback function when Language changes occur. */
    constructor(private callback: (records: LanguageRecord[]) => void) { }
    
    /** Configures the LanguageObserver to begin receiving notifications through its callback function when Language changes matching the given options occur. */
    observe(opts: LanguageObserverInit = {}): void {
        if (opts.localeFilter) this.localeFilter = opts.localeFilter;
        if (opts.phraseFilter) this.phraseFilter = opts.phraseFilter;
        if (opts.oldValue) this.oldValue = opts.oldValue;

        const onChange = (dict: HTMLIntlDictionaryElement) => {
            return (event: CustomEvent<string>) => {
                if (!this.localeFilter || !this.localeFilter.length || this.localeFilter && this.localeFilter.findIndex(x => x === event.detail) > -1) {
                    let localeRecord: LanguageRecord = {
                        type: 'locale',
                        value: event.detail
                    }
                    if (this.oldValue) {
                        const oldValue = this.previous.find(x => x.type === 'locale');
                        localeRecord = { ...localeRecord, oldValue: oldValue ? oldValue.value : null };
                    }
                    let records: LanguageRecord[] = [ localeRecord ];

                    if (this.phraseFilter) {
                        const phrases = this.phraseFilter.map(phrase => dict.resolvePhrase(phrase).then(x => x ? x : null));
                        Promise.all(phrases)
                            .then(resolved => {
                                const phraseRecords = resolved.map((value, i) => {
                                    let record: LanguageRecord = {
                                        type: 'phrase',
                                        phraseName: this.phraseFilter[i],
                                        value
                                    }
                                    if (this.oldValue) {
                                        const oldValue = this.previous.find(x => x.type === 'phrase' && x.phraseName === this.phraseFilter[i]);
                                        record = { ...record, oldValue: oldValue ? oldValue.value : null }
                                    }
                                    return record;
                                })
                                records = [...records, ...phraseRecords]
                                this.previous = records;
                                this.callback(records);
                            })
                    } else {
                        this.previous = records;
                        this.callback(records);
                    }
                }
            }
        }

        let cb: any;

        document
            .querySelector('intl-dictionary').componentOnReady()
            .then(dict => {
                cb = onChange(dict);
                cb(({ detail: dict.lang } as any));
                return dict;
            })
            .then(dict => {
                this.onChange = (event: CustomEvent<string>) => cb(event);
                dict.addEventListener('intlLocaleChange', this.onChange)
            })
    }

    /** Stops the LanguageObserver instance from receiving further notifications until and unless observe() is called again. */
    disconnect() {
        document
            .querySelector('intl-dictionary').componentOnReady()
            .then(dict => dict.removeEventListener('intlLocaleChange', this.onChange));
    }
}