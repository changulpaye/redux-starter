import moment from "moment";
    
export function getDifferenceInMinutes(oldTimeStamp) {
    return moment().diff(moment(oldTimeStamp), 'minutes');
}