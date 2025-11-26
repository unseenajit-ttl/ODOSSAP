
export interface BoredPilePoupModal{
	AddSpiral :	number,
 	CirculaRing:	number	 ,
 	DoubleLayerMB:	string,
 	DoubleLink:	string,
 	LinksEnd:	number	 ,
 	LinksStart:	number,
 	MainBars109:	string,
 	MainBars119:	string,
 	MainBars129:	string,
 	MainBars139:	string,
 	MainBars149:	string,
 	MainBars159:	string,
 	MainBars169:	string,
 	MainBars179:	string,
 	MainBars189:	string,
 	MainBars199:	string,
 	MainBars200:	string,
 	SingleLayerMB:	string,
 	SingleLink:	string,
 	SquareStiffner:	number,
 	Stiffner:	number
}

export interface MainBarList{
  main_bar_part_grade_field:string,
  main_bar_part_dia_field:string,
  main_bar_part_length_field:number,
  main_bar_part_quantity_field:number,
  main_bar_part_layer_field:number
}
export interface ElevationList{
  spiral_link_part_grade_field:string,
  spiral_link_part_dia_field:string,
  spiral_link_part_pitch_field:number,
  spiral_link_part_length_field:number,
}
export interface AdditionalSpiralList{
  additional_sprial_part_quantity_field:number,
  additional_sprial_part_position_field:number,
}
export interface CircularRingList{
  circular_ring_part_grade_field:string,
  circular_ring_part_dia_field:string,
  circular_ring_part_quantity_field:number,
}

export interface StiffnerList{
  stiffner_ring_part_grade_field:string,
  stiffner_ring_part_dia_field:string,
  stiffner_ring_part_position:number,
  stiffner_ring_part_stiffner:boolean,
}
