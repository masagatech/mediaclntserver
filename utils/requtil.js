const requtils = {};

requtils.res = function(_status, _data, _errcd, _err){
    return { 
        status: _status,
        data : _data,
        errcode: _errcd,
        err : _err
    };
}




module.exports = requtils;