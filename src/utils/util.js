import enquireJs from 'enquire.js'

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

const _toString = Object.prototype.toString



export function lineToHump(data) {
  if (data instanceof Array) {
    data.forEach((v) => lineToHump(v));
  } else if (data instanceof Object) {
    Object.keys(data).forEach(function (key) {
      let newKey = key.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
      if (newKey !== key) {
        data[newKey] = data[key];
        delete data[key];
      }
      lineToHump(data[newKey]);
    });
  }
  return data;
}

export function humpToLine(data) {
  if (data instanceof Array) {
    data.forEach((v) => humpToLine(v));
  } else if (data instanceof Object) {
    Object.keys(data).forEach(function (key) {
      let newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (newKey !== key) {
        data[newKey] = data[key];
        delete data[key];
      }
      humpToLine(data[newKey]);
    });
  }
  return data;
}

export function buildTree(data, key_filed, parent_filed, child_filed, parent_id) {
  let tree = [];
  for (let i = 0; i < data.length; i++) {
    data[i]['label'] = data[i]['name'];
    data[i]['value'] = data[i]['id'];
    if (data[i][parent_filed] == parent_id) {
      let childrens = buildTree(data, key_filed, parent_filed, child_filed, data[i][key_filed]);
      if (childrens.length) {
        data[i][child_filed] = childrens;
      }
      tree.push(data[i]);
    }
  }
  return tree;
}

export function getTreeParent(tree, childFiledName, parentFiledName, keyFiledName, childKeyFiledValue) {
  let parents = [];
  for (let i = 0; i < tree.length; i++) {
    if (tree[i][childFiledName]) {
      let childParents = getTreeParent(tree[i][childFiledName], childFiledName, parentFiledName, keyFiledName, childKeyFiledValue);
      if (childParents !== false) {
        parents.push(tree[i][keyFiledName]);
        for (let j = 0; j < childParents.length; j++) {
          parents.push(childParents[j]);
        }
        return parents;
      }
    } else {
      if (tree[i][keyFiledName] == childKeyFiledValue) {
        if (!tree[i][parentFiledName]) {
          return false;
        }
        return parents;
      }
    }
  }
  return false;
}

// 将平级列表转换为指向对象，降低时间复杂度
export function getTreeParentObj(permissionList) {
  let obj = {};
  permissionList.forEach((item) => {
    obj[item.id] = item.parentId;
  });
  return obj;
}

export function getParentId(permissionList, parentPointObj) {
  let arr = [];
  if (permissionList instanceof Array) {
    permissionList.map((value) => {
      if (parentPointObj[value]) {
        arr.push(parentPointObj[value]);
        let parentId = getParentId(
          parentPointObj[value],
          parentPointObj
        );
        arr = arr.concat(parentId);
      }
    });
  } else {
    if (parentPointObj[permissionList]) {
      arr.push(parentPointObj[permissionList]);
      let parentId = getParentId(
        parentPointObj[permissionList],
        parentPointObj
      );
      arr = arr.concat(parentId);
    }
  }
  return arr;
}