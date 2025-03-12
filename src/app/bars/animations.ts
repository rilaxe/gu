import {animate,query,sequence,stagger,style,transition,trigger} from "@angular/animations";

  
  export const DropDownAnimation = trigger("dropDownMenu", [
    transition(":enter", [
      style({ height: 0, overflow: "hidden" }),
      query(".menu-item", [
        style({ opacity: 0, transform: "translateY(-50px)" })
      ]),
      sequence([
        animate("200ms", style({ height: "*" })),
        query(".menu-item", [
          stagger(-50, [
            animate("300ms ease", style({ opacity: 1, transform: "none" }))
          ])
        ])
      ])
    ]),
  
    transition(":leave", [
      style({ height: "*", overflow: "hidden" }),
      query(".menu-item", [style({ opacity: 1, transform: "none" })]),
      sequence([
        query(".menu-item", [
          stagger(50, [
            animate(
              "300ms ease",
              style({ opacity: 0, transform: "translateY(-50px)" })
            )
          ])
        ]),
        animate("200ms", style({ height: 0 }))
      ])
    ])
  ]);


  export const SlideInAnimation =  trigger('slidein', [
    transition(':enter', [
      // when ngif has true
      style({ transform: 'translateY(35%)' }),
      animate("400ms ease", style({ transform: 'translateY(0)'}))
    ]),
    transition(':leave', [
      // when ngIf has false
      animate("400ms ease", style({ transform: 'translateX(50%)' }))
    ])
  ])

  export const WaveInAnimation =  trigger('wavein', [
    transition(':enter', [
      // when ngif has true
      style({ transform: 'translateX(-50%)' }),
      animate("400ms ease", style({ transform: 'translateY(0)'}))
    ]),
    transition(':leave', [
      // when ngIf has false
      animate("400ms ease", style({ transform: 'translateX(-80%)' }))
    ])
  ])
  