export default class DynamicArrayT{
    #lastAction = null

    #capacity = null;
    #sizepointers = 0;
    #pointersAdded = 0;
    #size = 0; 
    #sizeAdded = 0;

    #speedms = 0;
    #speednotation = null
    
    #space = 0;
    #spaceAdded = 0;
    #spacenotation = null

    #threads = 1;
 
    #array = []

    // null = 4 bytes
    // reference = 6 bytes
    // number = 8 bytes

    constructor(capacity){
        this.#capacity = capacity

        for(let i = 0; i < capacity; i++){
            this.#array.push(null)

            // for system
            this.#space += 4 // null variable
        }

        // for system
        this.#space += 8 + 8 // for size and capacity property
    }

    // JSON function
    toJSON() {
        return JSON.stringify({
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        })
    }
    
    static parse(serializedData) {
        serializedData = JSON.parse(serializedData)
 
        let newArray = new DynamicArrayT(serializedData.capacity)
        
        for(let i = 0; i < serializedData.size; i++){
            newArray.add(0)
        }

        newArray.setLastActionResult(serializedData)
    
        return newArray;
    }

    setLastActionResult(lastAction){
        this.#lastAction = lastAction.lastAction
        this.#speedms = lastAction.speedms
        this.#speednotation = lastAction.speednotation
        this.#sizepointers = lastAction.sizepointers
        this.#space = lastAction.space
        this.#spacenotation = lastAction.spacenotation
        this.#threads = lastAction.threads
        this.#spaceAdded = lastAction.spaceAdded
        this.#sizeAdded = lastAction.sizeAdded
        this.#pointersAdded = lastAction.pointersAdded
    }
    
    // general functions
    print(){
       console.log("Properties:", {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        });

       console.log("Array:", this.#array);
    }

    getLastActionResult(){
        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    size(){
        return this.#size
    }

    getCapacity(){
        return this.#capacity
    }

    update(index, item){
        this.#array[index] = item
    }

    // add functions
    add(item){
        // for system
        this.#spaceAdded = 0
        this.#sizeAdded = 0
        this.#threads = 1
        
        const startTime = performance.now();

        let index = this.#size;

        let isFull = this.isFull()

        if(isFull){ // array is full and has to enlarge
            this.#enlargeArray()
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
            this.#sizeAdded = this.#size // size added from array expansion
        }else{
            this.#speednotation = "O(1)"
            this.#spacenotation = "O(1)"
        }
        
        this.#array[index] = item

        this.#size += 1;

        // for system
        this.#spaceAdded += 2 // null to reference
        this.#space += 2

        const endTime = performance.now();

        // filling up capacity with null and computing space allocated
        // placed here so it does not affect the speed performance
        if(isFull){
            for(let i = 0; i < this.#capacity/2; i++){
                this.#array.push(null)
                this.#space += 4
                this.#spaceAdded += 4
            }
        }

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.#lastAction = "Add"
        this.#speedms = result
        
        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation, 
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    addAfterIndex(index, item){
        this.#sizeAdded = 0
        this.#spaceAdded = 0
        this.#threads = 1

        const startTime = performance.now();
        
        let isFull = this.isFull()
        if(isFull){
            this.#enlargeArray()
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
            this.#sizeAdded = this.#size // size added from array expansion
        }else if(index === this.#size-1){ // adding at tail
            this.#speednotation = "O(1)" 
            this.#spacenotation = "O(n)"
        }else{ // adding somewhere in the middle
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
        }

        this.#moveItemsToRight(index+1)

        this.#array[index+1] = item;
        // for system
        this.#space += 2 // null to reference (initial 4 + 2)
        this.#spaceAdded += 2

        this.#size += 1;

        // for system 
        const endTime = performance.now();

        // filling up capacity with null and computing space allocated
        // placed here so it does not affect the speed performance
        if(isFull){
            for(let i = 0; i < this.#capacity/2; i++){
                this.#array.push(null)
                this.#space += 4
                this.#spaceAdded += 4
            }
        }

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.#lastAction = "Add After Index"
        this.#speedms = result

        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    addBeforeIndex(index, item){
        this.#sizeAdded = 0
        this.#spaceAdded = 0
        this.#threads = 1

        const startTime = performance.now();

        if(this.isFull()){
            this.#enlargeArray()
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
            this.#sizeAdded = this.#size
        }else if(index === 0){
            this.#speednotation = "O(1)" 
            this.#spacenotation = "O(n)"
            this.#sizeAdded = 0
        }else{
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
            this.#sizeAdded = 0
        }

        this.#moveItemsToRight(index)

        this.#array[index] = item;

        const endTime = performance.now();

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6


        // result
        this.#lastAction = "Add Before Index"
        this.#speedms = result
        this.#size += 1;
        this.#space += 4
        this.#spaceAdded += 4

        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    delete(index){
        // speed is O(1) if and only if the node is the last (or equal to size-1) 
        this.#sizeAdded = 0
        this.#spaceAdded = 0
        this.#threads = 1

        const startTime = performance.now();

        if(index === this.#size-1){
            this.#speednotation = "O(1)"
            this.#spacenotation = "O(n)"
        }else{
            this.#speednotation = "O(n)"
            this.#spacenotation = "O(n)"
        }

        this.#moveItemsToLeft(index+1)
        this.#array[this.#size-1] = null

        this.#size -= 1;

        const endTime = performance.now();

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        // result
        this.#lastAction = "Delete"
        this.#speedms = result
        this.#space -= 2
        this.#spaceAdded -= 2

        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    get(index){
        this.#threads = 1
        this.#sizeAdded = 0
        this.#spaceAdded = 0
        this.#pointersAdded = 0

        const startTime = performance.now();

        let retrievedItem = this.#array[index];

        const endTime = performance.now();

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        // result
        this.#lastAction = "Get / Update"
        this.#speedms = result
        this.#speednotation = "O(1)"
        this.#spacenotation = "O(1)"

        return {
            capacity: this.#capacity,
            lastAction: this.#lastAction,
            speedms: this.#speedms,
            speednotation: this.#speednotation,
            size: this.#size,
            sizeAdded: this.#sizeAdded,
            sizepointers: this.#sizepointers,
            space: this.#space,
            spaceAdded: this.#spaceAdded,
            spacenotation: this.#spacenotation,
            threads: this.#threads,
            pointersAdded: this.#pointersAdded
        }
    }

    isFull(){
        return this.#size === this.#capacity
    }

    #enlargeArray(){
        let newArr = []

        let halfVal = Math.ceil(this.#size / 2);

        const migrateFirstHalf = async () => {
            // migrating first half values from orig to new array
            for(let i = 0; i < halfVal; i++){
                newArr.push(this.#array[i])
            }
    
            // for system
            this.#threads += 1
        }
    
        migrateFirstHalf();

        // migrating second half values from orig to new array
        for(let i = halfVal; i < this.#size; i++){
            newArr.push(this.#array[i])
        }

        this.#capacity *= 2;
        this.#array = newArr
    }

    #moveItemsToRight(startingIndex){
        for(let i = this.#size; i > startingIndex; i--){
            this.#array[i] = this.#array[i-1]
        }
    }

    #moveItemsToLeft(startingIndex){
        for(let i = startingIndex; i < this.#size; i++){
            this.#array[i-1] = this.#array[i]
        }
    }
}