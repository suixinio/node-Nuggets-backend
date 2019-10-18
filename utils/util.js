


function indexOf (val) { 
    for (var i = 0; i < this.length; i++) { 
    if (this[i] == val) return i; 
    } 
    return -1; 
};

// 删除数组具体元素
function remove (val) { 
    var index = indexOf(val); 
    if (index > -1) { 
        this.splice(index, 1); 
    } 
};

  module.exports = {
    remove
  }