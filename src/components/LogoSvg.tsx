import React from 'react';

/**
 * Componente SVG da logo - versão corrigida
 * Todos os círculos estão dentro dos limites do viewBox
 */
export function LogoSvg({ 
  width = 200, 
  height = 200,
  className = ''
}: { 
  width?: number; 
  height?: number;
  className?: string;
}) {
  // SVG corrigido - todos os círculos dentro dos limites
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="934" viewBox="0 0 1080 934" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="934" fill="black"/>
  <circle cx="510.24" cy="73.18" r="51.41" fill="rgb(176,171,150)"/>
  <circle cx="521.60" cy="36.20" r="1.61" fill="rgb(161,158,143)"/>
  <circle cx="506.99" cy="77.26" r="44.37" fill="rgb(171,162,131)"/>
  <circle cx="644.42" cy="88.69" r="53.43" fill="rgb(183,177,158)"/>
  <circle cx="637.65" cy="86.93" r="45.53" fill="rgb(170,162,132)"/>
  <circle cx="381.13" cy="61.59" r="12.14" fill="rgb(189,182,157)"/>
  <circle cx="380.40" cy="108.16" r="48.40" fill="rgb(172,165,136)"/>
  <circle cx="760.94" cy="134.30" r="53.55" fill="rgb(175,170,149)"/>
  <circle cx="751.56" cy="100.44" r="1.65" fill="rgb(167,159,136)"/>
  <circle cx="758.63" cy="141.17" r="44.33" fill="rgb(170,162,130)"/>
  <circle cx="269.99" cy="177.45" r="48.54" fill="rgb(171,164,137)"/>
  <circle cx="548.72" cy="168.40" r="35.11" fill="rgb(173,166,142)"/>
  <circle cx="271.26" cy="151.81" r="8.20" fill="rgb(172,159,127)"/>
  <circle cx="455.38" cy="180.66" r="34.32" fill="rgb(172,164,137)"/>
  <circle cx="561.36" cy="171.29" r="20.67" fill="rgb(171,161,128)"/>
  <circle cx="248.39" cy="160.61" r="14.84" fill="rgb(171,162,127)"/>
  <circle cx="300.46" cy="160.22" r="8.82" fill="rgb(171,160,127)"/>
  <circle cx="540.19" cy="169.10" r="15.01" fill="rgb(172,161,125)"/>
  <circle cx="642.66" cy="186.40" r="33.75" fill="rgb(171,164,137)"/>
  <circle cx="855.44" cy="227.37" r="49.32" fill="rgb(171,163,136)"/>
  <circle cx="270.59" cy="199.93" r="20.52" fill="rgb(171,162,126)"/>
  <circle cx="369.69" cy="220.44" r="34.15" fill="rgb(171,164,137)"/>
  <circle cx="674.12" cy="192.32" r="4.68" fill="rgb(188,184,168)"/>
  <circle cx="727.62" cy="233.49" r="36.16" fill="rgb(172,167,146)"/>
  <circle cx="724.83" cy="229.55" r="30.17" fill="rgb(170,162,130)"/>
  <circle cx="848.50" cy="208.31" r="3.73" fill="rgb(171,161,126)"/>
  <circle cx="878.46" cy="222.33" r="18.87" fill="rgb(169,163,123)"/>
  <circle cx="837.75" cy="210.49" r="6.67" fill="rgb(171,159,125)"/>
  <circle cx="501.01" cy="254.77" r="29.17" fill="rgb(173,166,146)"/>
  <circle cx="593.33" cy="258.84" r="28.76" fill="rgb(171,165,138)"/>
  <circle cx="188.66" cy="281.76" r="48.84" fill="rgb(172,164,136)"/>
  <circle cx="504.06" cy="254.09" r="24.32" fill="rgb(172,162,129)"/>
  <circle cx="839.00" cy="240.50" r="1.12" fill="rgb(166,160,126)"/>
  <circle cx="872.92" cy="240.75" r="2.21" fill="rgb(167,157,125)"/>
  <circle cx="867.83" cy="245.17" r="1.18" fill="rgb(171,160,126)"/>
  <circle cx="879.45" cy="249.02" r="7.51" fill="rgb(169,161,125)"/>
  <circle cx="521.67" cy="246.08" r="1.99" fill="rgb(162,154,132)"/>
  <circle cx="300.29" cy="285.27" r="34.03" fill="rgb(172,164,138)"/>
  <circle cx="857.21" cy="254.64" r="2.24" fill="rgb(170,159,126)"/>
  <circle cx="620.76" cy="258.72" r="5.29" fill="rgb(204,195,171)"/>
  <circle cx="521.25" cy="259.50" r="1.68" fill="rgb(165,159,132)"/>
  <circle cx="881.60" cy="259.20" r="1.26" fill="rgb(164,158,126)"/>
  <circle cx="864.25" cy="259.75" r="2.76" fill="rgb(170,160,126)"/>
  <circle cx="416.96" cy="287.28" r="28.54" fill="rgb(172,165,140)"/>
  <circle cx="201.50" cy="264.50" r="1.58" fill="rgb(162,156,122)"/>
  <circle cx="791.78" cy="299.87" r="34.31" fill="rgb(172,165,139)"/>
  <circle cx="674.49" cy="299.23" r="28.62" fill="rgb(172,165,142)"/>
  <circle cx="676.25" cy="284.75" r="2.37" fill="rgb(166,162,125)"/>
  <circle cx="687.20" cy="284.40" r="1.26" fill="rgb(160,155,124)"/>
  <circle cx="674.16" cy="300.58" r="11.26" fill="rgb(171,162,123)"/>
  <circle cx="664.43" cy="294.14" r="1.58" fill="rgb(168,160,125)"/>
  <circle cx="920.43" cy="342.41" r="48.16" fill="rgb(171,164,136)"/>
  <circle cx="771.20" cy="299.90" r="3.11" fill="rgb(169,158,124)"/>
  <circle cx="416.82" cy="314.05" r="7.82" fill="rgb(190,191,181)"/>
  <circle cx="195.71" cy="317.57" r="1.77" fill="rgb(168,160,124)"/>
  <circle cx="353.97" cy="352.53" r="29.22" fill="rgb(173,167,144)"/>
  <circle cx="255.52" cy="368.51" r="34.79" fill="rgb(171,165,140)"/>
  <circle cx="732.98" cy="369.44" r="28.60" fill="rgb(171,165,139)"/>
  <circle cx="351.57" cy="354.53" r="14.64" fill="rgb(172,162,123)"/>
  <circle cx="833.12" cy="385.11" r="34.36" fill="rgb(171,165,138)"/>
  <circle cx="252.34" cy="366.48" r="20.28" fill="rgb(170,163,127)"/>
  <circle cx="146.05" cy="405.44" r="49.09" fill="rgb(172,166,140)"/>
  <circle cx="146.79" cy="392.29" r="35.92" fill="rgb(171,162,127)"/>
  <circle cx="180.92" cy="393.40" r="4.73" fill="rgb(168,162,129)"/>
  <circle cx="813.43" cy="411.43" r="1.67" fill="rgb(192,189,173)"/>
  <circle cx="322.30" cy="438.52" r="28.59" fill="rgb(172,165,139)"/>
  <circle cx="145.70" cy="431.20" r="21.52" fill="rgb(170,162,127)"/>
  <circle cx="943.15" cy="471.38" r="48.76" fill="rgb(171,164,136)"/>
  <circle cx="236.87" cy="461.23" r="35.36" fill="rgb(174,167,142)"/>
  <circle cx="348.15" cy="429.62" r="2.31" fill="rgb(202,196,174)"/>
  <circle cx="758.98" cy="456.66" r="29.21" fill="rgb(172,165,141)"/>
  <circle cx="132.00" cy="444.27" r="4.01" fill="rgb(162,158,128)"/>
  <circle cx="347.94" cy="448.50" r="3.63" fill="rgb(202,196,173)"/>
  <circle cx="227.32" cy="449.78" r="4.82" fill="rgb(172,160,126)"/>
  <circle cx="845.68" cy="478.70" r="34.60" fill="rgb(171,164,137)"/>
  <circle cx="248.74" cy="459.82" r="15.07" fill="rgb(171,161,127)"/>
  <circle cx="259.38" cy="450.63" r="2.40" fill="rgb(170,161,128)"/>
  <circle cx="343.40" cy="455.20" r="1.26" fill="rgb(197,192,173)"/>
  <circle cx="230.67" cy="459.11" r="1.67" fill="rgb(172,157,128)"/>
  <circle cx="752.96" cy="462.04" r="4.49" fill="rgb(171,164,122)"/>
  <circle cx="338.71" cy="460.00" r="1.29" fill="rgb(199,190,167)"/>
  <circle cx="329.43" cy="464.87" r="4.65" fill="rgb(202,194,169)"/>
  <circle cx="990.47" cy="468.73" r="3.76" fill="rgb(204,199,178)"/>
  <circle cx="229.58" cy="471.72" r="7.76" fill="rgb(171,161,127)"/>
  <circle cx="878.49" cy="479.62" r="7.64" fill="rgb(195,189,177)"/>
  <circle cx="990.36" cy="478.18" r="3.20" fill="rgb(206,199,179)"/>
  <circle cx="240.39" cy="478.28" r="2.75" fill="rgb(165,159,127)"/>
  <circle cx="146.54" cy="537.09" r="49.16" fill="rgb(172,165,138)"/>
  <circle cx="328.91" cy="529.49" r="29.43" fill="rgb(172,166,142)"/>
  <circle cx="858.60" cy="508.80" r="1.26" fill="rgb(190,188,173)"/>
  <circle cx="331.33" cy="530.03" r="13.45" fill="rgb(170,162,126)"/>
  <circle cx="746.62" cy="547.26" r="28.70" fill="rgb(173,166,141)"/>
  <circle cx="171.86" cy="523.57" r="2.58" fill="rgb(169,159,126)"/>
  <circle cx="250.04" cy="555.50" r="34.86" fill="rgb(172,165,139)"/>
  <circle cx="166.20" cy="548.90" r="16.60" fill="rgb(170,160,125)"/>
  <circle cx="255.74" cy="540.52" r="7.60" fill="rgb(170,162,119)"/>
  <circle cx="745.21" cy="544.12" r="10.74" fill="rgb(171,162,122)"/>
  <circle cx="828.90" cy="571.71" r="34.94" fill="rgb(172,165,139)"/>
  <circle cx="182.00" cy="542.00" r="1.00" fill="rgb(170,160,126)"/>
  <circle cx="830.63" cy="548.63" r="3.74" fill="rgb(167,161,125)"/>
  <circle cx="132.36" cy="551.55" r="2.41" fill="rgb(169,158,126)"/>
  <circle cx="922.79" cy="570.12" r="59.12" fill="rgb(133,125,96)"/>
  <circle cx="922.82" cy="603.42" r="48.58" fill="rgb(115,103,59)"/>
  <circle cx="823.24" cy="578.63" r="19.79" fill="rgb(171,161,125)"/>
  <circle cx="851.67" cy="569.15" r="4.08" fill="rgb(169,161,125)"/>
  <circle cx="919.00" cy="567.00" r="2.00" fill="rgb(110,98,48)"/>
  <circle cx="146.69" cy="570.85" r="3.70" fill="rgb(166,160,125)"/>
  <circle cx="938.03" cy="579.95" r="9.54" fill="rgb(115,101,46)"/>
  <circle cx="916.56" cy="578.73" r="10.80" fill="rgb(118,101,47)"/>
  <circle cx="852.20" cy="580.60" r="1.26" fill="rgb(169,158,126)"/>
  <circle cx="371.96" cy="609.73" r="28.82" fill="rgb(173,166,141)"/>
  <circle cx="890.48" cy="596.59" r="15.48" fill="rgb(113,104,45)"/>
  <circle cx="240.17" cy="586.67" r="1.34" fill="rgb(202,203,181)"/>
  <circle cx="820.57" cy="589.39" r="3.04" fill="rgb(170,162,125)"/>
  <circle cx="696.49" cy="624.37" r="29.77" fill="rgb(173,168,146)"/>
  <circle cx="700.38" cy="624.82" r="21.23" fill="rgb(171,161,130)"/>
  <circle cx="291.58" cy="639.98" r="34.93" fill="rgb(172,166,139)"/>
  <circle cx="189.03" cy="660.27" r="50.30" fill="rgb(174,169,147)"/>
  <circle cx="877.14" cy="616.89" r="6.17" fill="rgb(157,146,121)"/>
  <circle cx="716.22" cy="615.67" r="1.84" fill="rgb(166,159,133)"/>
  <circle cx="965.59" cy="618.95" r="4.09" fill="rgb(156,147,120)"/>
  <circle cx="939.41" cy="625.40" r="9.91" fill="rgb(114,103,44)"/>
  <circle cx="782.01" cy="655.55" r="35.60" fill="rgb(173,167,144)"/>
  <circle cx="897.95" cy="625.36" r="3.76" fill="rgb(113,101,48)"/>
  <circle cx="909.39" cy="626.46" r="6.85" fill="rgb(116,101,45)"/>
  <circle cx="193.05" cy="661.48" r="41.11" fill="rgb(171,161,130)"/>
  <circle cx="881.73" cy="627.73" r="3.50" fill="rgb(147,141,114)"/>
  <circle cx="163.23" cy="633.68" r="7.42" fill="rgb(166,160,132)"/>
  <circle cx="960.33" cy="629.58" r="2.76" fill="rgb(160,150,112)"/>
  <circle cx="219.73" cy="634.64" r="1.87" fill="rgb(165,158,132)"/>
  <circle cx="683.74" cy="637.11" r="4.17" fill="rgb(166,159,133)"/>
  <circle cx="786.25" cy="654.94" r="24.52" fill="rgb(171,162,125)"/>
  <circle cx="890.34" cy="637.23" r="6.82" fill="rgb(160,152,129)"/>
  <circle cx="953.64" cy="636.70" r="5.72" fill="rgb(158,150,117)"/>
  <circle cx="923.67" cy="636.65" r="7.79" fill="rgb(113,101,47)"/>
  <circle cx="443.33" cy="666.22" r="29.08" fill="rgb(174,168,146)"/>
  <circle cx="901.45" cy="644.17" r="5.57" fill="rgb(154,147,124)"/>
  <circle cx="940.54" cy="644.75" r="3.54" fill="rgb(152,144,125)"/>
  <circle cx="901.10" cy="645.20" r="2.01" fill="rgb(171,164,147)"/>
  <circle cx="323.94" cy="649.00" r="3.14" fill="rgb(206,204,185)"/>
  <circle cx="620.66" cy="673.35" r="30.26" fill="rgb(173,167,144)"/>
  <circle cx="921.45" cy="647.71" r="13.61" fill="rgb(163,156,124)"/>
  <circle cx="921.22" cy="649.78" r="11.24" fill="rgb(190,183,152)"/>
  <circle cx="445.17" cy="666.14" r="19.28" fill="rgb(171,162,126)"/>
  <circle cx="531.86" cy="688.48" r="29.35" fill="rgb(173,167,143)"/>
  <circle cx="623.57" cy="678.66" r="20.13" fill="rgb(171,161,127)"/>
  <circle cx="314.00" cy="664.50" r="1.12" fill="rgb(200,198,184)"/>
  <circle cx="858.86" cy="717.94" r="49.00" fill="rgb(172,164,137)"/>
  <circle cx="355.25" cy="708.23" r="36.55" fill="rgb(177,172,153)"/>
  <circle cx="358.46" cy="708.21" r="30.48" fill="rgb(170,162,132)"/>
  <circle cx="530.96" cy="694.65" r="16.56" fill="rgb(171,161,127)"/>
  <circle cx="858.29" cy="683.43" r="1.77" fill="rgb(167,159,121)"/>
  <circle cx="870.08" cy="683.58" r="2.97" fill="rgb(167,162,122)"/>
  <circle cx="162.50" cy="686.60" r="6.00" fill="rgb(166,161,132)"/>
  <circle cx="219.82" cy="687.00" r="2.32" fill="rgb(164,157,131)"/>
  <circle cx="714.32" cy="719.32" r="34.99" fill="rgb(177,174,153)"/>
  <circle cx="713.71" cy="719.90" r="30.82" fill="rgb(169,162,131)"/>
  <circle cx="551.20" cy="693.40" r="1.61" fill="rgb(164,154,128)"/>
  <circle cx="333.63" cy="694.13" r="1.98" fill="rgb(164,164,140)"/>
  <circle cx="272.68" cy="763.55" r="49.28" fill="rgb(172,165,137)"/>
  <circle cx="441.00" cy="754.21" r="35.64" fill="rgb(174,168,145)"/>
  <circle cx="627.98" cy="760.49" r="35.40" fill="rgb(174,168,144)"/>
  <circle cx="439.69" cy="751.42" r="27.79" fill="rgb(170,162,128)"/>
  <circle cx="535.78" cy="770.56" r="36.73" fill="rgb(176,172,150)"/>
  <circle cx="626.24" cy="755.11" r="18.30" fill="rgb(171,163,125)"/>
  <circle cx="848.74" cy="744.74" r="2.83" fill="rgb(168,160,121)"/>
  <circle cx="463.44" cy="750.44" r="2.51" fill="rgb(169,160,131)"/>
  <circle cx="532.04" cy="771.63" r="30.68" fill="rgb(170,162,130)"/>
  <circle cx="605.71" cy="755.14" r="1.55" fill="rgb(165,160,128)"/>
  <circle cx="319.20" cy="755.60" r="1.26" fill="rgb(199,201,179)"/>
  <circle cx="224.94" cy="764.82" r="8.87" fill="rgb(201,198,184)"/>
  <circle cx="761.63" cy="805.80" r="48.99" fill="rgb(172,165,140)"/>
  <circle cx="420.80" cy="765.50" r="1.70" fill="rgb(165,158,131)"/>
  <circle cx="462.57" cy="765.64" r="2.60" fill="rgb(167,157,130)"/>
  <circle cx="648.56" cy="769.56" r="4.46" fill="rgb(169,160,128)"/>
  <circle cx="319.00" cy="771.00" r="1.41" fill="rgb(203,203,176)"/>
  <circle cx="773.51" cy="787.28" r="31.62" fill="rgb(171,163,123)"/>
  <circle cx="454.29" cy="774.14" r="1.55" fill="rgb(167,157,130)"/>
  <circle cx="560.67" cy="776.17" r="1.86" fill="rgb(163,156,135)"/>
  <circle cx="229.94" cy="784.76" r="3.24" fill="rgb(194,195,185)"/>
  <circle cx="382.60" cy="834.55" r="49.17" fill="rgb(172,165,137)"/>
  <circle cx="733.09" cy="805.30" r="6.79" fill="rgb(167,160,124)"/>
  <circle cx="303.80" cy="800.40" r="1.26" fill="rgb(201,195,182)"/>
  <circle cx="249.31" cy="805.19" r="2.60" fill="rgb(202,198,185)"/>
  <circle cx="294.54" cy="805.46" r="2.50" fill="rgb(199,195,182)"/>
  <circle cx="282.26" cy="810.36" r="5.90" fill="rgb(208,206,187)"/>
  <circle cx="263.41" cy="810.37" r="6.56" fill="rgb(205,204,185)"/>
  <circle cx="393.95" cy="813.16" r="3.77" fill="rgb(171,162,123)"/>
  <circle cx="640.34" cy="856.93" r="48.90" fill="rgb(172,165,137)"/>
  <circle cx="752.25" cy="821.81" r="19.87" fill="rgb(170,162,125)"/>
  <circle cx="510.28" cy="867.38" r="48.75" fill="rgb(173,165,137)"/>
  <circle cx="785.33" cy="823.50" r="1.54" fill="rgb(167,158,125)"/>
  <circle cx="805.63" cy="825.13" r="1.98" fill="rgb(212,206,187)"/>
  <circle cx="502.18" cy="829.36" r="3.20" fill="rgb(164,160,123)"/>
  <circle cx="772.19" cy="832.74" r="5.34" fill="rgb(168,163,125)"/>
  <circle cx="800.44" cy="834.11" r="1.94" fill="rgb(214,209,193)"/>
  <circle cx="502.54" cy="840.13" r="9.09" fill="rgb(170,161,122)"/>
  <circle cx="684.00" cy="838.50" r="1.12" fill="rgb(199,196,183)"/>
  <circle cx="795.88" cy="839.88" r="1.43" fill="rgb(208,205,190)"/>
  <circle cx="488.60" cy="843.07" r="2.15" fill="rgb(164,157,122)"/>
  <circle cx="790.46" cy="844.00" r="2.73" fill="rgb(217,213,195)"/>
  <circle cx="337.00" cy="848.19" r="3.34" fill="rgb(207,204,191)"/>
  <circle cx="682.24" cy="874.57" r="31.30" fill="rgb(217,214,193)"/>
  <circle cx="741.17" cy="849.17" r="1.18" fill="rgb(211,206,189)"/>
  <circle cx="782.18" cy="848.94" r="3.94" fill="rgb(210,207,191)"/>
  <circle cx="762.43" cy="853.69" r="11.45" fill="rgb(223,216,192)"/>
  <circle cx="425.20" cy="858.10" r="3.14" fill="rgb(214,208,189)"/>
  <circle cx="557.44" cy="861.30" r="5.31" fill="rgb(209,206,186)"/>
  <circle cx="385.70" cy="860.03" r="8.25" fill="rgb(173,162,122)"/>
  <circle cx="463.11" cy="869.38" r="13.65" fill="rgb(200,198,190)"/>
  <circle cx="341.89" cy="860.39" r="3.78" fill="rgb(213,206,188)"/>
  <circle cx="421.23" cy="863.54" r="2.75" fill="rgb(206,204,190)"/>
  <circle cx="346.82" cy="867.36" r="2.27" fill="rgb(217,211,193)"/>
  <circle cx="416.67" cy="868.67" r="1.49" fill="rgb(206,203,186)"/>
  <circle cx="594.60" cy="870.40" r="1.65" fill="rgb(208,205,180)"/>
  <circle cx="548.99" cy="891.48" r="23.70" fill="rgb(217,212,195)"/>
  <circle cx="411.33" cy="873.33" r="2.13" fill="rgb(216,212,192)"/>
  <circle cx="362.45" cy="878.00" r="2.65" fill="rgb(215,208,193)"/>
  <circle cx="403.47" cy="878.18" r="3.72" fill="rgb(214,210,191)"/>
  <circle cx="383.06" cy="882.44" r="8.95" fill="rgb(219,211,190)"/>
  <circle cx="604.33" cy="887.67" r="1.49" fill="rgb(208,205,181)"/>
  <circle cx="472.35" cy="896.20" r="10.25" fill="rgb(212,204,188)"/>
  <circle cx="609.33" cy="892.67" r="1.49" fill="rgb(208,205,184)"/>
  <circle cx="507.69" cy="897.92" r="3.09" fill="rgb(166,161,124)"/>
  <circle cx="615.36" cy="897.18" r="2.64" fill="rgb(212,209,189)"/>
  <circle cx="626.57" cy="902.26" r="4.74" fill="rgb(215,211,183)"/>
  <circle cx="656.03" cy="902.27" r="6.10" fill="rgb(217,214,193)"/>
  <circle cx="482.79" cy="906.50" r="3.16" fill="rgb(217,212,198)"/>
  <circle cx="526.26" cy="912.00" r="3.87" fill="rgb(219,213,194)"/>
  <circle cx="493.79" cy="911.93" r="2.94" fill="rgb(217,213,188)"/>
</svg>`;

  // SECURITY: SVG content is static and hardcoded, safe for dangerouslySetInnerHTML
  return (
    <div 
      className={className}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
