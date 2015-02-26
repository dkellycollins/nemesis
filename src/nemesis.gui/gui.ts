class GUI {
    private _mapping: any;

    public setValue(name: string, value: any) {
        _mapping[name] = value;
    }

    public render() {
        for(var id in this._mapping) {
            if(this._mapping.hasOwnProperty(id)) {
                var value = this._mapping[id];

                if(typeof value === 'function') {
                    value = value();
                }

                var elements = document.getElementsByClassName(id);
                elements.forEach((element) => {
                    element.innerText = value;
                })
            }
        }
    }
}