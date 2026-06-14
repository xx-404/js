(function () {

  function createDefaultState() {
    return {
      selectedLine: 'all',
      filters: {
        status: 'all',
        keyword: ''
      },
      orders: [
        { id: 'ORD-1001', orderNo: 'MO-202606-101', productName: '智能传感器控制板', line: 'SMT-01', priority: '高', planQty: 1800, completedQty: 1260, goodQty: 1225, defectQty: 35, status: '生产中', planDate: '2026-06-13', remark: '重点订单，需优先备料', progress: 70, operator: '一班组', lastUpdate: '09:30' },
        { id: 'ORD-1002', orderNo: 'MO-202606-102', productName: '伺服驱动器主控单元', line: 'ASM-02', priority: '中', planQty: 960, completedQty: 430, goodQty: 419, defectQty: 11, status: '生产中', planDate: '2026-06-13', remark: '下午安排终检抽检', progress: 45, operator: '二班组', lastUpdate: '10:05' },
        { id: 'ORD-1003', orderNo: 'MO-202606-103', productName: '工业网关通信模组', line: 'PKG-03', priority: '低', planQty: 1200, completedQty: 1200, goodQty: 1188, defectQty: 12, status: '已完成', planDate: '2026-06-12', remark: '已完成包装入库', progress: 100, operator: '包装组', lastUpdate: '08:20' },
        { id: 'ORD-1004', orderNo: 'MO-202606-104', productName: '能源采集终端', line: 'SMT-01', priority: '高', planQty: 1500, completedQty: 0, goodQty: 0, defectQty: 0, status: '待开工', planDate: '2026-06-14', remark: '等待来料确认', progress: 0, operator: '计划排产', lastUpdate: '11:00' }
      ],
      reports: [
        { id: 'R-9001', time: '10:20', orderId: 'ORD-1001', output: 120, goodQty: 117, defectQty: 3, hours: 1.5, operator: '张晓峰', remark: '过炉温度已校正' },
        { id: 'R-9002', time: '09:50', orderId: 'ORD-1002', output: 90, goodQty: 88, defectQty: 2, hours: 1, operator: '陈可心', remark: '装配节拍稳定' },
        { id: 'R-9003', time: '09:15', orderId: 'ORD-1001', output: 110, goodQty: 106, defectQty: 4, hours: 1, operator: '张晓峰', remark: '更换一批焊膏' }
      ],
      qualityRecords: [
        { id: 'Q-7001', orderId: 'ORD-1001', type: '巡检', result: '合格', inspector: '李梦瑶', time: '10:10', remark: '锡点外观正常' },
        { id: 'Q-7002', orderId: 'ORD-1002', type: '首检', result: '待复判', inspector: '高志峰', time: '09:40', remark: '扭矩值接近上限' },
        { id: 'Q-7003', orderId: 'ORD-1003', type: '终检', result: '合格', inspector: '李梦瑶', time: '08:55', remark: '包装标签一致' }
      ],
      equipment: [
        { id: 'EQ-301', name: '高速贴片机', line: 'SMT-01', status: '运行中', oee: 91, owner: '黄工', remark: '设备运行平稳' },
        { id: 'EQ-302', name: '回流焊炉', line: 'SMT-01', status: '待机', oee: 84, owner: '黄工', remark: '等待下一批次' },
        { id: 'EQ-401', name: '自动锁附机', line: 'ASM-02', status: '运行中', oee: 88, owner: '赵工', remark: '扭矩程序已更新' },
        { id: 'EQ-501', name: '自动包装线', line: 'PKG-03', status: '维护中', oee: 72, owner: '苏工', remark: '更换传感器中' }
      ],
      inventory: [
        { id: 'INV-001', code: 'MAT-A100', name: 'MCU 主控芯片', type: '原料', qty: 2800, safetyStock: 1200, location: 'A-01-03' },
        { id: 'INV-002', code: 'MAT-B210', name: '铝电解电容', type: '原料', qty: 860, safetyStock: 900, location: 'A-02-02' },
        { id: 'INV-003', code: 'WIP-330', name: '焊接半成品板', type: '半成品', qty: 540, safetyStock: 300, location: 'WIP-01' },
        { id: 'INV-004', code: 'FG-520', name: '工业网关成品', type: '成品', qty: 180, safetyStock: 150, location: 'FG-02' }
      ],
      inventoryTransactions: [],
      plans: [
        { id: 'PL-1001', orderId: 'ORD-1001', line: 'SMT-01', planDate: '2026-06-14', shift: '白班', status: '已下发' },
        { id: 'PL-1002', orderId: 'ORD-1002', line: 'ASM-02', planDate: '2026-06-14', shift: '夜班', status: '待排产' }
      ],
      teams: [
        { id: 'EMP-001', name: '张晓峰', groupName: '一班组', role: 'SMT 操作员', status: '在岗' },
        { id: 'EMP-002', name: '李梦瑶', groupName: '质量组', role: '检验员', status: '在岗' },
        { id: 'EMP-003', name: '陈可心', groupName: '二班组', role: '装配员', status: '培训中' }
      ],
      maintenancePlans: [
        { id: 'MT-3001', equipmentId: 'EQ-301', type: '日保养', planDate: '2026-06-14', owner: '黄工', status: '待执行' },
        { id: 'MT-3002', equipmentId: 'EQ-501', type: '校准', planDate: '2026-06-15', owner: '苏工', status: '执行中' }
      ],
      andons: [
        { id: 'AND-001', line: 'ASM-02', type: '设备异常', owner: '陈工', status: '处理中', time: '10:18', remark: '锁附机扭矩报警' },
        { id: 'AND-002', line: 'SMT-01', type: '物料短缺', owner: '仓储协调', status: '待响应', time: '09:36', remark: '焊膏余量不足' }
      ],
      traceRecords: [
        { id: 'TR-001', serialNo: 'SN-20260613-001', orderId: 'ORD-1001', batchNo: 'LOT-20260613-A', process: '贴片', status: '已绑定' },
        { id: 'TR-002', serialNo: 'SN-20260613-002', orderId: 'ORD-1002', batchNo: 'LOT-20260613-B', process: '装配', status: '已绑定' }
      ],
      documents: [
        { id: 'DOC-001', orderId: 'ORD-1001', name: '贴片工艺指导书', version: 'V2.1', status: '生效中' },
        { id: 'DOC-002', orderId: 'ORD-1002', name: '装配扭矩规范', version: 'V1.3', status: '待审批' }
      ],
      shipments: [
        { id: 'SHIP-001', orderId: 'ORD-1003', customer: '华南能源客户', carrier: '德邦工业物流', status: '已签收' },
        { id: 'SHIP-002', orderId: 'ORD-1002', customer: '华东自动化客户', carrier: '顺丰工业物流', status: '待出库' }
      ],
      supplierRecords: [
        { id: 'SUP-001', orderId: 'ORD-1001', supplier: '宏达电子', material: 'MCU 主控芯片', result: '合格' },
        { id: 'SUP-002', orderId: 'ORD-1004', supplier: '智联材料', material: '铝电解电容', result: '待检' }
      ],
      energyRecords: [
        { id: 'EN-001', line: 'SMT-01', shift: '白班', power: 420, water: 2.4, carbon: 235, time: '10:00' },
        { id: 'EN-002', line: 'ASM-02', shift: '白班', power: 310, water: 1.6, carbon: 173, time: '10:00' }
      ],
      stations: [
        { id: 'ST-001', code: 'ST-SMT-01', line: 'SMT-01', process: '印刷', owner: '刘工', status: '运行中' },
        { id: 'ST-002', code: 'ST-ASM-03', line: 'ASM-02', process: '锁附', owner: '赵工', status: '换型中' },
        { id: 'ST-003', code: 'ST-PKG-02', line: 'PKG-03', process: '包装', owner: '苏工', status: '待机' }
      ],
      timeline: [
        { time: '10:30', text: 'SMT-01 报工新增 120 件，当前工单完成率提升至 70%' },
        { time: '10:10', text: '巡检完成，MO-202606-101 检验结果为合格' },
        { time: '09:45', text: 'ASM-02 更新装配程序，设备 OEE 提升 2%' },
        { time: '09:20', text: '库存预警：铝电解电容低于安全库存' }
      ],
      schedulings: [
        { id: 'SCH-001', orderId: 'ORD-1001', line: 'SMT-01', startTime: '08:00', endTime: '16:00', priority: '高', status: '执行中', operator: '一班组' },
        { id: 'SCH-002', orderId: 'ORD-1002', line: 'ASM-02', startTime: '08:30', endTime: '17:00', priority: '中', status: '待确认', operator: '二班组' }
      ],
      toolings: [
        { id: 'TL-001', code: 'MOLD-A101', name: '传感器外壳模具', type: '注塑模', totalShots: 500000, currentShots: 382000, status: '使用中', location: '注塑车间', lastMaintenance: '2026-06-01' },
        { id: 'TL-002', code: 'FIXT-B201', name: '装配定位夹具', type: '工装夹具', totalShots: 200000, currentShots: 185000, status: '待保养', location: '装配线', lastMaintenance: '2026-05-15' }
      ],
      boms: [
        { id: 'BOM-001', productName: '智能传感器控制板', version: 'V1.2', status: '生效中', createDate: '2026-05-20', items: 12 },
        { id: 'BOM-002', productName: '伺服驱动器主控单元', version: 'V2.0', status: '生效中', createDate: '2026-06-01', items: 18 }
      ],
      exceptions: [
        { id: 'EXC-001', orderId: 'ORD-1001', type: '设备停机', severity: '高', description: '贴片机真空泵异常', status: '处理中', reporter: '张晓峰', time: '09:30' },
        { id: 'EXC-002', orderId: 'ORD-1002', type: '质量偏差', severity: '中', description: '扭矩值波动超标', status: '已关闭', reporter: '陈可心', time: '08:45' }
      ],
      changeovers: [
        { id: 'CO-001', line: 'SMT-01', fromOrder: 'ORD-1003', toOrder: 'ORD-1001', duration: 35, targetDuration: 30, status: '已完成', operator: '刘工', date: '2026-06-12' },
        { id: 'CO-002', line: 'PKG-03', fromOrder: '', toOrder: 'ORD-1003', duration: 45, targetDuration: 25, status: '进行中', operator: '苏工', date: '2026-06-13' }
      ],
      spcRecords: [
        { id: 'SPC-001', orderId: 'ORD-1001', dimension: '焊点间距', usl: 1.0, lsl: 0.6, mean: 0.78, std: 0.05, cpk: 1.47, time: '10:00' },
        { id: 'SPC-002', orderId: 'ORD-1002', dimension: '扭矩值', usl: 5.5, lsl: 4.5, mean: 5.12, std: 0.08, cpk: 1.33, time: '09:00' }
      ],
      ncms: [
        { id: 'NCM-001', orderId: 'ORD-1001', partName: 'PCB板', defectType: '焊点桥接', qty: 5, disposition: '返工', status: '处理中', inspector: '李梦瑶', time: '09:50' },
        { id: 'NCM-002', orderId: 'ORD-1002', partName: '连接器', defectType: '引脚变形', qty: 3, disposition: '报废', status: '已关闭', inspector: '高志峰', time: '09:00' }
      ],
      measures: [
        { id: 'MSR-001', name: '数显卡尺', code: 'CAL-001', type: '长度', accuracy: '0.01mm', lastCalDate: '2026-05-15', nextCalDate: '2026-08-15', status: '正常' },
        { id: 'MSR-002', name: '扭矩扳手', code: 'CAL-002', type: '力矩', accuracy: '0.1Nm', lastCalDate: '2026-04-20', nextCalDate: '2026-07-20', status: '待校准' }
      ],
      audits: [
        { id: 'AUD-001', type: '内部审核', scope: 'SMT-01生产过程', auditor: '张质量', planDate: '2026-06-20', findings: 3, status: '计划中' },
        { id: 'AUD-002', type: '外部审核', scope: 'ISO 9001体系', auditor: 'SGS审核组', planDate: '2026-06-10', findings: 5, status: '进行中' }
      ],
      warehouses: [
        { id: 'WH-001', zone: 'A区', location: 'A-01-01', type: '原料仓', capacity: 5000, used: 3200, status: '正常' },
        { id: 'WH-002', zone: 'B区', location: 'B-02-03', type: '成品仓', capacity: 3000, used: 2800, status: '预警' }
      ],
      procurements: [
        { id: 'PR-001', supplier: '宏达电子', material: 'MCU 主控芯片', qty: 5000, orderDate: '2026-06-10', dueDate: '2026-06-20', status: '运输中' },
        { id: 'PR-002', supplier: '智联材料', material: '铝电解电容', qty: 3000, orderDate: '2026-06-12', dueDate: '2026-06-18', status: '待确认' }
      ],
      returnRecords: [
        { id: 'RTN-001', orderId: 'ORD-1001', supplier: '宏达电子', material: 'PCB基板', qty: 50, reason: '来料尺寸偏差', status: '待审核', date: '2026-06-13' },
        { id: 'RTN-002', orderId: 'ORD-1003', customer: '华南能源客户', material: '工业网关成品', qty: 2, reason: '外观划伤', status: '已退货', date: '2026-06-11' }
      ],
      batchRecords: [
        { id: 'BAT-001', batchNo: 'LOT-20260613-A', material: 'MCU 主控芯片', supplier: '宏达电子', manufactureDate: '2026-05-01', expiryDate: '2027-05-01', qty: 5000, status: '正常' },
        { id: 'BAT-002', batchNo: 'LOT-20260613-B', material: '铝电解电容', supplier: '智联材料', manufactureDate: '2026-04-15', expiryDate: '2027-04-15', qty: 3000, status: '临期' }
      ],
      spareparts: [
        { id: 'SP-001', code: 'SPR-P001', name: '贴片机吸嘴', equipmentId: 'EQ-301', qty: 20, safetyStock: 10, location: '备件库-A-01' },
        { id: 'SP-002', code: 'SPR-B001', name: '回流焊加热管', equipmentId: 'EQ-302', qty: 5, safetyStock: 3, location: '备件库-B-02' }
      ],
      sparepartTransactions: [],
      ledgers: [
        { id: 'LDG-001', code: 'EQ-301', name: '高速贴片机', model: 'YSM-20R', manufacturer: '雅马哈', purchaseDate: '2024-03-15', warranty: '2027-03-15', status: '在用', value: 850000 },
        { id: 'LDG-002', code: 'EQ-401', name: '自动锁附机', model: 'SD-500T', manufacturer: '快克', purchaseDate: '2025-01-10', warranty: '2028-01-10', status: '在用', value: 420000 }
      ],
      repairs: [
        { id: 'RPR-001', equipmentId: 'EQ-501', faultDesc: '传感器信号丢失', repairType: '电气维修', status: '维修中', reporter: '苏工', time: '10:00', cost: 1500 },
        { id: 'RPR-002', equipmentId: 'EQ-302', faultDesc: '温控偏差', repairType: '机械维修', status: '待维修', reporter: '黄工', time: '09:00', cost: 0 }
      ],
      attendances: [
        { id: 'ATT-001', empId: 'EMP-001', name: '张晓峰', date: '2026-06-13', shift: '白班', checkIn: '07:55', checkOut: '17:05', status: '正常' },
        { id: 'ATT-002', empId: 'EMP-003', name: '陈可心', date: '2026-06-13', shift: '白班', checkIn: '08:10', checkOut: '16:50', status: '迟到' }
      ],
      trainingRecords: [
        { id: 'TRN-001', empId: 'EMP-003', name: '陈可心', course: 'ESD静电防护', startDate: '2026-06-15', endDate: '2026-06-16', status: '待培训', result: '' },
        { id: 'TRN-002', empId: 'EMP-001', name: '张晓峰', course: '高级SMT操作', startDate: '2026-05-10', endDate: '2026-05-12', status: '已认证', result: '优秀' }
      ],
      performances: [
        { id: 'PRF-001', empId: 'EMP-001', name: '张晓峰', period: '2026Q2', outputKpi: 95, qualityKpi: 92, safetyKpi: 100, score: 95.7, status: '已审核' },
        { id: 'PRF-002', empId: 'EMP-002', name: '李梦瑶', period: '2026Q2', outputKpi: 88, qualityKpi: 96, safetyKpi: 100, score: 94.0, status: '待审核' }
      ],
      safetyRecords: [
        { id: 'SAF-001', type: '巡检', location: 'SMT-01产线', inspector: '李安全', finding: '静电手环佩戴不规范', severity: '低', status: '已整改', date: '2026-06-12' },
        { id: 'SAF-002', type: '事故', location: 'ASM-02产线', inspector: '车间主管', finding: '操作员手部轻微夹伤', severity: '中', status: '处理中', date: '2026-06-13' }
      ]
    };
  }

  function loadState() {
    var base = createDefaultState();
    try {
      var saved = JSON.parse(localStorage.getItem('mes-multi-page-demo-state'));
      if (!saved || typeof saved !== 'object') return base;
      return Object.assign({}, base, saved, {
        filters: Object.assign({}, base.filters, (saved.filters || {})),
        inventoryTransactions: Array.isArray(saved.inventoryTransactions) ? saved.inventoryTransactions : [],
        sparepartTransactions: Array.isArray(saved.sparepartTransactions) ? saved.sparepartTransactions : []
      });
    } catch (ex) {
      return base;
    }
  }

  var state = loadState();

  window.MESData = {
    createDefaultState: createDefaultState,
    loadState: loadState,
    get state() { return state; },
    set state(v) { state = v; }
  };

})();