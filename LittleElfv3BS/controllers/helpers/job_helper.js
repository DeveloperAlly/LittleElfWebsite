

export function getJobParameters(params) {
  const newjobParams = params;
  newjobParams.isActive = true;
  newjobParams.hypoallergic = false;
  newjobParams.fastTurnaround = false;
  if (!params.hypoallergic) {
    newjobParams.hypoallergic = true;
  }
  if (!params.fastTurnaround) {
    newjobParams.fastTurnaround = true;
  }
  return newjobParams;
}

export function getDate(date) {
  const inputdate = date;
  const split = inputdate.split(' ');
  const split2 = split[1].split('/');
  const pudate = new Date(split2[2], split2[1], split2[0]);
  console.log('formatted pudate', pudate);
  return pudate;
}

export function getDay(date) {
  const split = date.split(' ');
  const day = split[0];
  console.log('day', day);
  return day;
}
