export const manifest = {
  screens: {
    scr_iz33g0: { name: "Landing", route: "/", position: { "x": 160, "y": 220 } },
    scr_3z7dhl: { name: "Dashboard", route: "/dashboard", position: { "x": 1560, "y": 220 } },
    scr_l6ejou: { name: "Privacy Policy", route: "/privacy", position: { "x": 160, "y": 2200 } },
    scr_dsf9up: { name: "Terms & Conditions", route: "/terms", position: { "x": 1560, "y": 2200 } }
  },
  sections: {
    sec_u3xzfl: { name: "Main App Flow", x: 0, y: 0, width: 2920, height: 1180 },
    sec_ibzg9m: { name: "Legal Pages", x: 0, y: 1980, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_u3xzfl", children: [
    { kind: "screen", id: "scr_iz33g0" },
    { kind: "screen", id: "scr_3z7dhl" }]
  },
  { kind: "section", id: "sec_ibzg9m", children: [
    { kind: "screen", id: "scr_l6ejou" },
    { kind: "screen", id: "scr_dsf9up" }]
  }]

};