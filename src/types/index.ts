export type Role='DONOR'|'NGO'|'DRIVER'|'ADMIN';
export type DonationStatus='MATCHING'|'OFFERED'|'MATCHED'|'PICKUP_ACCEPTED'|'PICKED_UP'|'IN_TRANSIT'|'DELIVERED'|'NOT_FEASIBLE'|'CANCELLED';
export interface Donation {id:string; foodName:string; category:string; quantity:number; pickup:string; latitude:number; longitude:number; expiresAt:string; status:DonationStatus; shelter?:string; driver?:string; notes?:string; score?:number}
export interface Match {shelter:string; distance:number; travel:number; score:number; capacity:number; eligible:boolean; reason?:string}
export interface Notice {id:string; title:string; message:string; at:string; read:boolean}
