class TreeNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// avl tree
export class PivotTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        if (node === null) return 0;
        return node.height;
    }

    getBalance(node) {
        if (node === null) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    rotateRight(z) {
        let y = z.left;
        let T3 = y.right;

        y.right = z;
        z.left = T3;

        z.height = Math.max(this.getHeight(z.left), this.getHeight(z.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    rotateLeft(z) {
        let y = z.right;
        let T2 = y.left;

        y.left = z;
        z.right = T2;

        z.height = Math.max(this.getHeight(z.left), this.getHeight(z.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    add(key, value) {
        this.root = this._addNode(this.root, key, value);
    }

    _addNode(node, key, value) {
        if (node === null) return new TreeNode(key, value);

        if (key < node.key) {
            node.left = this._addNode(node.left, key, value);
        } else if (key > node.key) {
            node.right = this._addNode(node.right, key, value);
        } else {
            node.value = value; // Update value if key already exists
            return node;
        }

        // Update height of current node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // Get balance factor and balance the node if needed
        let balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && key < node.left.key) {
            return this.rotateRight(node);
        }
        // Right Right Case
        if (balance < -1 && key > node.right.key) {
            return this.rotateLeft(node);
        }
        // Left Right Case
        if (balance > 1 && key > node.left.key) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        // Right Left Case
        if (balance < -1 && key < node.right.key) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    get(key) {
        return this._getNode(this.root, key);
    }

    _getNode(node, key) {
        if (node === null) return null;

        if (key === node.key) {
            return node;
        } else if (key < node.key) {
            return this._getNode(node.left, key);
        } else {
            return this._getNode(node.right, key);
        }
    }

    getClosestNode(index) {
        let closestNode = null;
        let currentNode = this.root;

        while (currentNode) {
            // If the current node's key is equal to the index, return the current node
            if (currentNode.key === index) {
                return currentNode;
            }

            // Update closest node if the current node is closer to the index
            if (!closestNode || Math.abs(currentNode.key - index) < Math.abs(closestNode.key - index)) {
                closestNode = currentNode;
            }

            // Traverse left or right based on the index value and current node's key
            if (index < currentNode.key) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        return closestNode;
    }

    update(key, value) {
        let node = this.get(key);

        if (node !== null) {
            node.key = value;
        } else {
            console.log("Key does not exist.");
        }
    }

    delete(key) {
        this.root = this._deleteNode(this.root, key);
    }
    
    _deleteNode(root, key) {
        if (root === null) return root;
    
        // If the key to be deleted is smaller than the root's key, then it lies in the left subtree
        if (key < root.key) {
            root.left = this._deleteNode(root.left, key);
        }
        // If the key to be deleted is greater than the root's key, then it lies in the right subtree
        else if (key > root.key) {
            root.right = this._deleteNode(root.right, key);
        }
        // If key is same as root's key, then this is the node to be deleted
        else {
            // Node with only one child or no child
            if (root.left === null) {
                return root.right;
            } else if (root.right === null) {
                return root.left;
            }
    
            // Node with two children: Get the inorder successor (smallest in the right subtree)
            let temp = this._minValueNode(root.right);
    
            // Copy the inorder successor's content to this node
            root.key = temp.key;
            root.value = temp.value;
    
            // Delete the inorder successor
            root.right = this._deleteNode(root.right, temp.key);
        }
    
        // Update height of the current node
        root.height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;
    
        // Check the balance factor to rebalance the tree
        let balance = this.getBalance(root);
    
        // Left Left Case
        if (balance > 1 && this.getBalance(root.left) >= 0) {
            return this.rotateRight(root);
        }
        // Left Right Case
        if (balance > 1 && this.getBalance(root.left) < 0) {
            root.left = this.rotateLeft(root.left);
            return this.rotateRight(root);
        }
        // Right Right Case
        if (balance < -1 && this.getBalance(root.right) <= 0) {
            return this.rotateLeft(root);
        }
        // Right Left Case
        if (balance < -1 && this.getBalance(root.right) > 0) {
            root.right = this.rotateRight(root.right);
            return this.rotateLeft(root);
        }
    
        return root;
    }
    
    _minValueNode(node) {
        let current = node;
    
        while (current.left !== null) {
            current = current.left;
        }
    
        return current;
    }

    print() {
        this._printPreOrder(this.root);
    }

    _printPreOrder(node) {
        if (node !== null) {
            console.log(`Key: ${node.key}, Value: ${node.value.value}`);
            this._printPreOrder(node.left);
            this._printPreOrder(node.right);
        }
    }

    movePointersLeft(index) {
        this._movePointersLeft(this.root, index);
    }
    
    async _movePointersLeft(node, index) {
        if (node === null) return;

        // move list node to left everything greater than given index
        if (node.key > index) {
           node.value = node.value.prev
        }

        this._movePointersLeft(node.left, index); // 1
        this._movePointersLeft(node.right, index); // 2
    }

    _updateValues(node, value) {
        if (node === null) return;
        
        // Update the value of the current node and move to its left and right subtrees
        node.value = value;
        this._updateValues(node.left, value);
        this._updateValues(node.right, value);
    }

    movePointersRight(index) {
        this._movePointersRight(this.root, index);
        
    }
    
    // visits all the node
    _movePointersRight(node, index) {
        if (node === null) return;

        // update value or delete

        if (node.key >= index) {
            // if not tail
            if(node.value.next){
                node.value = node.value.next;
            }else{ // if tail
                // console.log(index)
                // this._deleteNode(this.root, node.key)
            }
        }

        this._movePointersRight(node.left, index);
        this._movePointersRight(node.right, index);
    }

}

// node for the frequencylistv2
export class ListNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// FrequencyListV2 class with AVL tree instead of array for pivot pointers
export default class FrequencyListV2T {
    constructor(frequency) {
        this.head = null;
        this.tail = null;
        this._size = 0;
        this.frequency = frequency;
        this.pivotTree = new PivotTree();

        // for system
        this.lastAction = null
        this.speedms = 0
        this.speednotation = null
        this._sizepointers = 0

        // initial space from pivotTree
        // 8 for size
        // 8 for frequency
        // 6 for pivotTree object referencce
        // 4 each for head and tail
        this.space =  8 + 8 + 6 + 4 + 4

        this.spacenotation = null
        this.threads = 0

        this.spaceAdded = 0
        this._sizeAdded = 0
        this.pointersAdded = 0
    }

    // system methods
    toJSON(){
        return JSON.stringify({
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation : this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        })
    }

    static parse(serializedData){
        serializedData = JSON.parse(serializedData)

        let newList = new FrequencyListV2T(serializedData.frequency);

        for(let i = 0; i < serializedData.size; i++){
            newList.add(i);
        }
    
        newList.setLastActionResult(serializedData)
    
        return newList;
    }

    setLastActionResult(lastAction){
        this.lastAction = lastAction.lastAction
        this.speedms = lastAction.speedms
        this.speednotation = lastAction.speednotation
        this._sizepointers = lastAction.sizepointers
        this.space = lastAction.space
        this.spacenotation = lastAction.spacenotation
        this.threads = lastAction.threads
        this.spaceAdded = lastAction.spaceAdded
        this._sizeAdded = lastAction.sizeAdded
        this.pointersAdded = lastAction.pointersAdded
    }

    getLastActionResult(){
        return {
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation: this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        }
    }

    size(){
        return this._size
    }

    // adds a node with the given value at the end of the list.
    // head is always the first node
    // tail is always the last node
    add(value) {
        // for system 
        this.spaceAdded = 0
        this._sizeAdded = 0
        this.pointersAdded = 0
        this.threads = 0

        const startTime = performance.now(); // getting execution time

        const newNode = new ListNode(value);
        //for system
        this.spaceAdded += 8
        this.space += 8

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;

            // for system
            // 2 bytes each for head and tail, from null to reference.
            // 4 bytes each for newNode's null prev and next
            this.space += 2 + 2 + 4 + 4
            this.spaceAdded += 2 + 2 + 4 + 4

            this.speednotation = "O(1)"
            this.spacenotation = "O(1)"
    
            this._sizepointers = 2
            this.pointersAdded += 2 // head and tail
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;

            // for system
            this.speednotation = "O(1)"
            this.spacenotation = "O(1)"
            // add 2 from previously null next pointer of tail
            // add 4 from null next pointer of newNode
            // add 6 from prev reference of newNode
            this.spaceAdded += 2 + 4 + 6
            this.space += 2 + 4 + 6 
        }
        
        this._size++;
        this._sizeAdded += 1 // for system
        
        // checks if its time to add
        // if yes, add the newNode and set its key as its index in the list.
        if (this._size % this.frequency === 0) {
            this.pivotTree.add(this._size - 1, newNode);

            // for system
            // + 20 for tree node added in pivotTree (20 is approximate)
            // + 6 for newNode reference
            this.space += 20 + 6
            this.spaceAdded += 20 + 6

            this._sizepointers += 1
            this.pointersAdded += 1
           
            this.speednotation = "O(log n)"
            this.spacenotation = "O(log n)"  
        }

        // for system
        // computing speedms or execution time
        const endTime = performance.now();
        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.lastAction = "Add"
        this.speedms = result;

        return {
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation: this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        }
    }

    // adds an item after the given index.
    addAfterIndex(index, item) {
        if (index < 0 || index >= this._size) {
            throw new Error('Index out of bounds');
        }

        // for system 
        this.spaceAdded = 0
        this._sizeAdded = 0
        this.pointersAdded = 0
        this.threads = 0

        const startTime = performance.now(); // getting execution time

        const newNode = new ListNode(item); // create the node to be added
        // for system. space added from the newNode
        this.space += 8 
        this.spaceAdded += 8

        const currentNode = this.getNode(index); // get the node at the given index
         
        const nextNode = currentNode.next;
        newNode.prev = currentNode;
        newNode.next = nextNode;

        // for system
        // 6 for prev and 4/6 for newNode's next reference above.
        this.space += nextNode ? 6 + 6 : 4 + 6 
        this.spaceAdded += nextNode ? 6 + 6 : 4 + 6

        currentNode.next = newNode;

        if (nextNode) {
            nextNode.prev = newNode;
        } else {
            this.tail = newNode;

            // for system
            this.space += 2 // from null to reference
            this.spaceAdded += 2
        }

        this._size++;
        this._sizeAdded += 1

        // Update pivot trees. move pointers to left.
        this.pivotTree.movePointersLeft(index) 
        this.threads = Math.floor(this.size() / this.frequency) // one extra threads used for ever node visit in pivot tree
        this.speednotation = "O(n)" // where n is the number of pivot pointers not the list
        this.spacenotation = "O(1)"

        // If the new node is added at a pivot index, update AVL tree
        if (this._size % this.frequency === 0) {
            this.pivotTree.add(this._size-1, this.tail);

            // for system
            // + 20 for tree node added in pivotTree (20 is approximate)
            // + 6 for newNode reference
            this.space += 20 + 6
            this.spaceAdded += 20 + 6

            this._sizepointers += 1
            this.pointersAdded += 1
           
            this.spacenotation = "O(log n)"  
        }

        // for system
        // computing speedms or execution time
        const endTime = performance.now();
        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.lastAction = "Add After Index"
        this.speedms = result;

        return {
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation: this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        }
    }
    
    // returns the value of the node at given index
    get(index){
        if(index < 0 || index >= this._size){
            throw new Error("Index out of bounds")
        }

        // for system
        this._sizeAdded = 0
        this.spaceAdded = 0
        this.pointersAdded = 0
        this.threads = 0

        const startTime = performance.now(); // for execution time

        let returnValue = this.getNode(index).value // return item when used regularly 

        // for system
        const endTime = performance.now();

        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.lastAction = "Get / Update"
        this.speedms = result
        this.speednotation = "O(log n)"
        this.spacenotation = "O(1)"

        return {
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation: this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        }
    }

    // returns the node at the given index
    getNode(index) {
        if (index < 0 || index > this._size-1) throw new Error("index out of bounds");
         
         // getting the closest pivot pointer from the given index.
         // this includes the key or index of the pivotNode
         const pivotNode = this.findClosestPivot(index);
         let closestPivotIndex
         let current
         
         if(!pivotNode){ // if pivot node is empty; no pivot  pointers yet, choose between head or tail.
             let tailIndex = this.size -1
             let headIndex = 0
     
             if((index - headIndex) < (tailIndex - index)){ // tail is closer
                 closestPivotIndex = this.size-1
                 current = this.tail
             }else{ // head is closer
                 closestPivotIndex = 0
                 current = this.head
             }
         }else{
             closestPivotIndex = pivotNode.key
             current = pivotNode.value;
         }

        //traverse the list from the closest pivot
        
        if (index < closestPivotIndex) {
            for(let i = index; i < closestPivotIndex; i++){
                current = current.prev;
            }
        } else if(index > closestPivotIndex){
            for(let i = closestPivotIndex; i < index; i++){
                current = current.next;
            }
        }
        
        return current; // now the node at the given index
    }

    // deletes the node at given index
    // updates pivot pointers in pivotTree
    delete(index) {
        if (index < 0 || index > this._size-1) throw new Error("index out of bounds");
        
        // for system 
        this.spaceAdded = 0
        this._sizeAdded = 0
        this.pointersAdded = 0
        this.threads = 0

        const startTime = performance.now(); // getting execution time

        // get the node at the given index
        const node = this.getNode(index);

        // for system. getting the node at given index is O(1)
        this.speednotation = "O(log n)" // due to binary traversal in pivotTree (AVL TREE)
        this.spacenotation = "O(log n)"
        this.space -= 8 // value of node to delete
        this.spaceAdded -= 8

        if (!node) return false;

        if (node.prev) {
            node.prev.next = node.next;

            // for system
            // -6 as nodeTodelete prev is reference
            // -2 for prev's next pointer or 0 if no next pointer
            this.space -= node.next ? 6 : 2 + 6 
            this.spaceAdded -= node.next ? 6 : 2 + 6 
        } else {
            this.head = node.next;

            // for system
            // -4 as nodeToDelete prev is null
            // -2 for prev's next pointer or 0 if no next pointer
            this.space -= node.next ? 4 : 2 + 4
            this.spaceAdded -= node.next ? 4 : 2 + 4 
        }

        if (node.next) {
            node.next.prev = node.prev;

            // for system
            // -6 as nodeTodelete next is reference
            // -2 for next's prev pointer or 0 if no prev pointer
            this.space -= node.prev ? 6 : 2 + 6 
            this.spaceAdded -= node.prev ? 6 : 2 + 6 
        } else {
            this.tail = node.prev;

            // for system
            // -4 as nodeToDelete next is null
            // -2 for next's prev pointer or 0 if no prev pointer
            this.space -= node.prev ? 4 : 2 + 4
            this.spaceAdded -= node.prev ? 4 : 2 + 4 
        }

        this._size--;
        this._sizeAdded -= 1 // for system

        // move pointers to right to make pointers stay pointing at frequency indeces
        this.pivotTree.movePointersRight(index)

        // for system
        this.threads = Math.floor(this.size() / this.frequency) // one extra threads used for ever node visit in pivot tree
        this.speednotation = "O(n)" // where n is the number of pivot pointers
        this.spacenotation = "O(log n)"

        // for when the pivotTree will delete a pivot pointer
        if((this._size + 1) % this.frequency === 0){
            this.pivotTree.delete(this.size-1)

            this._sizepointers -= 1
            this.pointersAdded -= 1

            this.spaceAdded -= 20 + 6  // removed pivot pointer from pivotTree
            this.space -= 20 + 6
        }

        // for system
        // computing speedms or execution time
        const endTime = performance.now();
        let rawElapsedTime = endTime - startTime;
        let result = Math.floor(rawElapsedTime * 1e6) / 1e6

        this.lastAction = "Delete"
        this.speedms = result;

        return {
            lastAction: this.lastAction,
            speedms: this.speedms,
            speednotation: this.speednotation,
            size: this._size,
            sizepointers: this._sizepointers,
            space: this.space,
            spacenotation: this.spacenotation,
            threads: this.threads,
            frequency: this.frequency,
            spaceAdded: this.spaceAdded,
            sizeAdded: this._sizeAdded,
            pointersAdded: this.pointersAdded
        }
    }

    // get the closest node in the pivot tree
    // this returns node from pivotTree, including its key (the node's index in the list)
    findClosestPivot(index){
        return this.pivotTree.getClosestNode(index)
    }

    print() {
        let current = this.head;
        let i = 0
        while (current) {
            let pivotMarker = '';
            if (this.pivotTree.get(i) !== null) {
                pivotMarker = ' (pivot)';
            }
            console.log(`Index: ${i}, Value: ${current.value}${pivotMarker}`);
            current = current.next;
            i++
        }

        this.pivotTree.print()
        
        console.log(this.threads + "asdasd")
    }
}
