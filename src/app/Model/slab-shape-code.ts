import { SlabShapeParameter } from "./slab-shape-parameter"

export interface SlabShapeCode {

    INTSHAPEID	: number,
    VCHSHAPECODE:string,
    ShapeParam: SlabShapeParameter,
    VCHMESHSHAPEGROUP:string,	
    BITBENDINDICATOR:any,	
    BITCREEPDEDUCTATMO1:any,
    BITCREEPDEDUCTATCO1:any,
    CHRMOCO	:any,
    BITSHAPEPOPUP	:any,
    NOOFBENDS	:number,
    INTMWBENDPOSITION	:number,
    INTCWBENDPOSITION	:number,
    INTNOOFMWBEND:number,	
    INTNOOFCWBEND	:number,
    VCHCWBVBSTEMPLATE	:any,
    VCHMWBVBSTEMPLATE:any
    
}

