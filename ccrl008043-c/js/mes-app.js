(function () {

  var _state = window.MESData.state;
  var pageKey = window.MES_PAGE || 'dashboard';

  function state() { return _state; }
  function updateState(patch) {
    Object.assign(_state, patch);
    try { localStorage.setItem('mes-multi-page-demo-state', JSON.stringify(_state)); } catch (ex) {}
  }

  function e(val) { return String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function badge(text) {
    var cls = '';
    var t = String(text || '');
    if (t === '运行中' || t === '生产中' || t === '正常' || t === '在岗' || t === '合格' || t === '已完成' || t === '已下发' || t === '已签收' || t === '生效中' || t === '已绑定' || t === '已关闭' || t === '已认证' || t === '已审核' || t === '已整改' || t === '已退货' || t === '执行中' || t === '运输中' || t === '在用') cls = 'running';
    else if (t === '待机' || t === '待开工' || t === '待执行' || t === '待响应' || t === '待审批' || t === '待排产' || t === '待确认' || t === '待检' || t === '待出库' || t === '待审核' || t === '待培训' || t === '待维修' || t === '待校准' || t === '待保养' || t === '计划中' || t === '待复判' || t === '待确认' || t === '待退货') cls = 'pending';
    else if (t === '维护中' || t === '换型中' || t === '维修中' || t === '处理中' || t === '进行中' || t === '培训中') cls = 'warning';
    else if (t === '预警' || t === '临期' || t === '迟到') cls = 'danger';
    else if (t === '已绑定' || t === '已处理') cls = 'running';
    else cls = 'idle';
    return '<span class="badge ' + cls + '">' + e(text) + '</span>';
  }

  function getOrderById(id) { return (state().orders || []).filter(function (o) { return o.id === id; })[0]; }
  function getEquipmentById(id) { return (state().equipment || []).filter(function (eq) { return eq.id === id; })[0]; }

  function optionsFromOrders(selectedId) {
    return (state().orders || []).map(function (o) {
      return '<option value="' + e(o.id) + '"' + (o.id === selectedId ? ' selected' : '') + '>' + e(o.orderNo) + ' \u00b7 ' + e(o.productName) + '</option>';
    }).join('');
  }

  function optionsFromEquipment(selectedId) {
    return (state().equipment || []).map(function (eq) {
      return '<option value="' + e(eq.id) + '"' + (eq.id === selectedId ? ' selected' : '') + '>' + e(eq.name) + '</option>';
    }).join('');
  }

  function optionsFromTeams(selectedId) {
    return (state().teams || []).map(function (emp) {
      return '<option value="' + e(emp.id) + '"' + (emp.id === selectedId ? ' selected' : '') + '>' + e(emp.name) + ' (' + e(emp.role) + ')</option>';
    }).join('');
  }

  function twoColumn(left, right) { return '<div class="content-grid"><div class="panel">' + left + '</div><div class="panel">' + right + '</div></div>'; }

  function sectionCard(title, desc, body, action) {
    return '<div class="panel-head"><div><h3>' + e(title) + '</h3>' + (desc ? '<small>' + e(desc) + '</small>' : '') + '</div>' + (action || '') + '</div>' + body;
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function commit(msg) {
    updateState({});
    toast(msg || '已保存');
    renderCurrentPage();
  }

  var menuGroups = [
    {
      title: '生产管理',
      items: [
        { key: 'dashboard', label: '生产看板', desc: '全局生产概览' },
        { key: 'orders', label: '工单管理', desc: '工单排产与跟踪' },
        { key: 'report', label: '报工记录', desc: '生产报工与工时' },
        { key: 'quality', label: '质量检验', desc: '巡检、首检、终检' },
        { key: 'equipment', label: '设备监控', desc: '设备状态与OEE' },
        { key: 'inventory', label: '库存管理', desc: '物料库存与出入库' }
      ]
    },
    {
      title: '计划与排程',
      items: [
        { key: 'planning', label: '计划排程', desc: '生产计划下发' },
        { key: 'workforce', label: '班组管理', desc: '人员与班组分配' },
        { key: 'maintenance', label: '维护保养', desc: '设备保养计划' }
      ]
    },
    {
      title: '质量与追溯',
      items: [
        { key: 'andon', label: '安灯异常', desc: '异常呼叫处理' },
        { key: 'trace', label: '追溯管理', desc: '批次追溯与绑定' },
        { key: 'document', label: '文档管理', desc: '工艺文件与版本' }
      ]
    },
    {
      title: '物流与仓储',
      items: [
        { key: 'shipping', label: '发货管理', desc: '发货与物流跟踪' },
        { key: 'station', label: '工位管理', desc: '工位状态与配置' },
        { key: 'supplier', label: '供应商质量', desc: '来料检验与评价' },
        { key: 'energy', label: '能源管理', desc: '能耗监测与统计' }
      ]
    }
  ];

  function menuLink(key, label, desc) {
    var active = pageKey === key ? ' active' : '';
    return '<a class="menu-link' + active + '" href="' + e(key === 'dashboard' ? 'index.html' : key + '.html') + '"><span>' + e(label) + '</span><small>' + e(desc) + '</small></a>';
  }

  function renderShell() {
    var body = document.body;
    var menuHtml = menuGroups.map(function (group) {
      var links = group.items.map(function (item) { return menuLink(item.key, item.label, item.desc); }).join('');
      return '<div class="menu-group"><div class="menu-group-title">' + e(group.title) + '</div><div class="menu-links">' + links + '</div></div>';
    }).join('');

    body.innerHTML = '<div class="app-shell">' +
      '<aside class="sidebar"><div class="sidebar-head"><div class="eyebrow">MES 系统</div><h1>智造协同平台</h1><p>实时监控生产全流程</p></div><div class="menu-scroll">' + menuHtml + '</div></aside>' +
      '<main class="page-shell"><div id="pageContent"></div></main>' +
      '</div>';
  }

  // ---- 看板指标环比（与昨日对比的历史快照）----
  var METRIC_HISTORY_LIMIT = 30;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function dateKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

  function todayKey() { return dateKey(new Date()); }

  function round1(n) { return Math.round(n * 10) / 10; }

  function computeDashboardMetrics() {
    var orders = state().orders || [];
    var equipment = state().equipment || [];
    var totalDone = orders.reduce(function (s, o) { return s + (o.completedQty || 0); }, 0);
    var totalDefect = orders.reduce(function (s, o) { return s + (o.defectQty || 0); }, 0);
    var avgOee = equipment.reduce(function (s, eq) { return s + (eq.oee || 0); }, 0) / (equipment.length || 1);
    var defectRate = totalDone > 0 ? (totalDefect / totalDone) * 100 : 0;
    return { totalOrders: orders.length, totalDone: totalDone, avgOee: avgOee, defectRate: defectRate };
  }

  function getMetricHistory() {
    return Array.isArray(state().metricHistory) ? state().metricHistory : [];
  }

  // 取“昨日”：历史中日期早于今天、且最接近今天的一条快照
  function getPreviousDaySnapshot() {
    var today = todayKey();
    var prior = getMetricHistory().filter(function (s) { return s.date < today; });
    if (prior.length === 0) return null;
    prior.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return prior[0];
  }

  // 首次使用且无任何历史时，依据当前指标生成一条“昨日”基线，使环比立即可用
  function seedBaselineSnapshotIfEmpty(metrics) {
    if (getMetricHistory().length > 0) return;
    var y = new Date();
    y.setDate(y.getDate() - 1);
    updateState({ metricHistory: [{
      date: dateKey(y),
      totalOrders: Math.max(0, metrics.totalOrders - 1),
      totalDone: Math.round(metrics.totalDone * 0.92),
      avgOee: round1(metrics.avgOee - 1.5),
      defectRate: round1(metrics.defectRate + 0.3)
    }] });
  }

  // 记录/更新今天的快照（同一天覆盖），并限制历史条数上限
  function recordDailySnapshot(metrics) {
    var today = todayKey();
    var history = getMetricHistory().filter(function (s) { return s.date !== today; });
    history.push({
      date: today,
      totalOrders: metrics.totalOrders,
      totalDone: metrics.totalDone,
      avgOee: round1(metrics.avgOee),
      defectRate: round1(metrics.defectRate)
    });
    history.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (history.length > METRIC_HISTORY_LIMIT) history = history.slice(history.length - METRIC_HISTORY_LIMIT);
    updateState({ metricHistory: history });
  }

  // 环比指示：上涨=绿色▲，下跌=红色▼，无对比/持平=灰色
  function renderMetricTrend(current, previous, decimals) {
    if (previous == null || isNaN(previous)) {
      return '<div class="metric-trend flat"><span class="trend-arrow">\u2014</span> 暂无对比</div>';
    }
    var factor = Math.pow(10, decimals);
    var rounded = Math.round((current - previous) * factor) / factor;
    if (rounded === 0) {
      return '<div class="metric-trend flat"><span class="trend-arrow">\u2014</span> 较昨日持平</div>';
    }
    var up = rounded > 0;
    var arrow = up ? '\u25B2' : '\u25BC';
    var val = decimals > 0 ? Math.abs(rounded).toFixed(decimals) : Math.abs(rounded);
    var shown = (up ? '+' : '-') + val;
    return '<div class="metric-trend ' + (up ? 'up' : 'down') + '"><span class="trend-arrow">' + arrow + '</span> ' + shown + ' 较昨日</div>';
  }

  function renderDashboard() {
    var orders = state().orders || [];
    var metrics = computeDashboardMetrics();
    seedBaselineSnapshotIfEmpty(metrics);
    var prevSnapshot = getPreviousDaySnapshot();
    recordDailySnapshot(metrics);
    var totalDone = metrics.totalDone;
    var avgOee = metrics.avgOee;
    var defectRate = metrics.defectRate.toFixed(1);

    var orderRows = orders.map(function (o) {
      return '<tr><td><a href="orders.html">' + e(o.orderNo) + '</a></td><td>' + e(o.productName) + '</td><td>' + e(o.line) + '</td><td>' + badge(o.priority) + '</td><td>' + e(o.status) + '</td><td><div class="progress"><div style="width:' + (o.progress || 0) + '%"></div></div><small>' + (o.progress || 0) + '%</small></td><td>' + o.completedQty + ' / ' + o.planQty + '</td></tr>';
    }).join('');

    var timeline = (state().timeline || []).map(function (t) {
      return '<div class="timeline-item"><div><strong>' + e(t.time) + '</strong></div><div>' + e(t.text) + '</div></div>';
    }).join('');

    var andons = (state().andons || []).map(function (a) {
      var cls = a.status === '处理中' ? 'warning' : 'danger';
      return '<div class="alert-item ' + cls + '"><div class="row-line"><strong>' + e(a.type) + '</strong>' + badge(a.status) + '</div><small>' + e(a.line) + ' \u00b7 ' + e(a.owner) + ' \u00b7 ' + e(a.time) + '</small><div>' + e(a.remark) + '</div></div>';
    }).join('');

    return '<div class="page-header"><div><h2>生产看板</h2><p>全局生产概览与实时监控</p></div></div>' +
      '<div class="stats-grid">' +
        '<div class="metric-card"><small>总工单数</small><strong>' + orders.length + '</strong><span>个</span>' + renderMetricTrend(metrics.totalOrders, prevSnapshot ? prevSnapshot.totalOrders : null, 0) + '</div>' +
        '<div class="metric-card"><small>今日完成</small><strong>' + totalDone.toLocaleString() + '</strong><span>件</span>' + renderMetricTrend(metrics.totalDone, prevSnapshot ? prevSnapshot.totalDone : null, 0) + '</div>' +
        '<div class="metric-card"><small>平均OEE</small><strong>' + avgOee.toFixed(1) + '</strong><span>%</span>' + renderMetricTrend(metrics.avgOee, prevSnapshot ? prevSnapshot.avgOee : null, 1) + '</div>' +
        '<div class="metric-card"><small>不良率</small><strong>' + defectRate + '</strong><span>%</span>' + renderMetricTrend(metrics.defectRate, prevSnapshot ? prevSnapshot.defectRate : null, 1) + '</div>' +
      '</div>' +
      '<div class="content-grid">' +
        '<div class="panel">' + sectionCard('活跃工单', '当前生产中的工单列表', '<div class="table-wrap"><table><thead><tr><th>工单号</th><th>产品</th><th>产线</th><th>优先级</th><th>状态</th><th>进度</th><th>完成/计划</th></tr></thead><tbody>' + orderRows + '</tbody></table></div>') + '</div>' +
        '<div class="stack-list">' +
          sectionCard('实时动态', '最新生产事件', '<div class="stack-list">' + timeline + '</div>') +
          sectionCard('安灯异常', '待处理异常', '<div class="stack-list">' + andons + '</div>') +
        '</div>' +
      '</div>';
  }

  function renderOrders() {
    var orders = state().orders || [];
    var filterStatus = state().filters.status || 'all';
    var filterKeyword = (state().filters.keyword || '').toLowerCase();

    var filtered = orders.filter(function (o) {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (filterKeyword && o.orderNo.toLowerCase().indexOf(filterKeyword) === -1 && o.productName.toLowerCase().indexOf(filterKeyword) === -1) return false;
      return true;
    });

    var rows = filtered.map(function (o) {
      return '<tr><td><input type="checkbox" class="batch-checkbox" data-id="' + e(o.id) + '"></td><td>' + e(o.orderNo) + '</td><td>' + e(o.productName) + '</td><td>' + e(o.line) + '</td><td>' + badge(o.priority) + '</td><td>' + badge(o.status) + '</td><td>' + o.completedQty + ' / ' + o.planQty + '</td><td>' + e(o.planDate) + '</td><td>' + e(o.operator) + '</td><td>' + e(o.remark) + '</td></tr>';
    }).join('') || '<tr><td colspan="10"><div class="empty">无匹配工单</div></td></tr>';

    return '<div class="page-header"><div><h2>工单管理</h2><p>工单排产、跟踪与状态管理</p></div><div class="header-actions"><a class="primary-btn" href="report.html">快速报工</a></div></div>' +
      '<div class="panel">' +
        sectionCard('工单列表', '筛选与查看所有工单',
          '<div class="filter-row"><input id="keywordFilter" type="text" placeholder="搜索工单号或产品名称" value="' + e(state().filters.keyword || '') + '"><select id="statusFilter"><option value="all"' + (filterStatus === 'all' ? ' selected' : '') + '>全部状态</option><option value="生产中"' + (filterStatus === '生产中' ? ' selected' : '') + '>生产中</option><option value="已完成"' + (filterStatus === '已完成' ? ' selected' : '') + '>已完成</option><option value="待开工"' + (filterStatus === '待开工' ? ' selected' : '') + '>待开工</option></select></div>' +
          '<div class="table-wrap"><table><thead><tr><th><input type="checkbox" id="selectAllOrders"></th><th>工单号</th><th>产品</th><th>产线</th><th>优先级</th><th>状态</th><th>完成/计划</th><th>计划日期</th><th>班组</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
          '<div class="batch-summary"><div class="batch-summary-stats"><span id="batchCount">已选中 0 项</span></div><div class="batch-actions"><button class="small-btn" id="batchStartBtn" disabled>批量开工</button><button class="small-btn" id="batchCompleteBtn" disabled>批量完成</button></div></div>',
          '<div class="header-actions"><button class="primary-btn" id="newOrderBtn">新建工单</button></div>'
        ) +
      '</div>' +
      '<div id="newOrderPanel" class="panel" style="display:none">' +
        sectionCard('新建工单', '创建新的生产工单',
          '<form id="orderForm" class="form-grid">' +
            '<div class="field"><label>工单号</label><input name="orderNo" type="text" value="MO-202606-105"></div>' +
            '<div class="field"><label>产品名称</label><input name="productName" type="text" value="新产品"></div>' +
            '<div class="field"><label>产线</label><select name="line"><option value="SMT-01">SMT-01</option><option value="ASM-02">ASM-02</option><option value="PKG-03">PKG-03</option></select></div>' +
            '<div class="field"><label>优先级</label><select name="priority"><option value="中">中</option><option value="高">高</option><option value="低">低</option></select></div>' +
            '<div class="field"><label>计划数量</label><input name="planQty" type="number" min="1" value="1000"></div>' +
            '<div class="field"><label>计划日期</label><input name="planDate" type="date" value="2026-06-14"></div>' +
            '<div class="field"><label>班组</label><input name="operator" type="text" value="一班组"></div>' +
            '<div class="field full"><label>备注</label><textarea name="remark" placeholder="工单备注信息"></textarea></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">创建工单</button><button class="ghost-btn" type="button" id="cancelOrderBtn">取消</button></div>' +
          '</form>') +
      '</div>';
  }

  function renderReport() {
    var rows = (state().reports || []).map(function (r) {
      var order = getOrderById(r.orderId);
      return '<tr><td>' + e(r.id) + '</td><td>' + e(order ? order.orderNo : r.orderId) + '</td><td>' + e(r.time) + '</td><td>' + r.output + '</td><td>' + r.goodQty + '</td><td>' + r.defectQty + '</td><td>' + r.hours + '</td><td>' + e(r.operator) + '</td><td>' + e(r.remark) + '</td></tr>';
    }).join('') || '<tr><td colspan="9"><div class="empty">暂无报工记录</div></td></tr>';

    return '<div class="page-header"><div><h2>报工记录</h2><p>生产报工与工时统计</p></div></div>' +
      twoColumn(
        sectionCard('报工列表', '查看所有生产报工记录', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>时间</th><th>产出</th><th>良品</th><th>不良</th><th>工时</th><th>操作员</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增报工', '记录本班次生产数据',
          '<form id="reportForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>产出数量</label><input name="output" type="number" min="1" value="120"></div>' +
            '<div class="field"><label>良品数量</label><input name="goodQty" type="number" min="0" value="117"></div>' +
            '<div class="field"><label>不良数量</label><input name="defectQty" type="number" min="0" value="3"></div>' +
            '<div class="field"><label>工时(小时)</label><input name="hours" type="number" step="0.1" min="0.1" value="1.5"></div>' +
            '<div class="field"><label>操作员</label><input name="operator" type="text" value="张晓峰"></div>' +
            '<div class="field full"><label>备注</label><textarea name="remark" placeholder="生产备注"></textarea></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">提交报工</button></div></form>'));
  }

  function renderQuality() {
    var rows = (state().qualityRecords || []).map(function (r) {
      var order = getOrderById(r.orderId);
      return '<tr><td>' + e(r.id) + '</td><td>' + e(order ? order.orderNo : r.orderId) + '</td><td>' + e(r.type) + '</td><td>' + badge(r.result) + '</td><td>' + e(r.inspector) + '</td><td>' + e(r.time) + '</td><td>' + e(r.remark) + '</td></tr>';
    }).join('') || '<tr><td colspan="7"><div class="empty">暂无检验记录</div></td></tr>';

    return '<div class="page-header"><div><h2>质量检验</h2><p>巡检、首检、终检记录</p></div></div>' +
      twoColumn(
        sectionCard('检验记录', '查看所有质量检验记录', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>类型</th><th>结果</th><th>检验员</th><th>时间</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增检验', '记录质量检验结果',
          '<form id="qualityForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>检验类型</label><select name="type"><option value="巡检">巡检</option><option value="首检">首检</option><option value="终检">终检</option></select></div>' +
            '<div class="field"><label>检验结果</label><select name="result"><option value="合格">合格</option><option value="待复判">待复判</option><option value="不合格">不合格</option></select></div>' +
            '<div class="field"><label>检验员</label><input name="inspector" type="text" value="李梦瑶"></div>' +
            '<div class="field full"><label>备注</label><textarea name="remark" placeholder="检验备注"></textarea></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存记录</button></div></form>'));
  }

  function renderEquipment() {
    var cards = (state().equipment || []).map(function (eq) {
      return '<div class="metric-card"><div class="row-line"><strong>' + e(eq.name) + '</strong>' + badge(eq.status) + '</div><small>' + e(eq.line) + ' \u00b7 负责人：' + e(eq.owner) + '</small><span>OEE ' + (eq.oee || 0) + '%</span><div class="progress"><div style="width:' + (eq.oee || 0) + '%"></div></div><small>' + e(eq.remark) + '</small></div>';
    }).join('');

    var rows = (state().equipment || []).map(function (eq) {
      return '<tr><td>' + e(eq.id) + '</td><td>' + e(eq.name) + '</td><td>' + e(eq.line) + '</td><td>' + badge(eq.status) + '</td><td>' + (eq.oee || 0) + '%</td><td>' + e(eq.owner) + '</td><td>' + e(eq.remark) + '</td></tr>';
    }).join('');

    return '<div class="page-header"><div><h2>设备监控</h2><p>设备状态与OEE实时监控</p></div></div>' +
      '<div class="card-grid">' + cards + '</div>' +
      '<div class="panel">' + sectionCard('设备列表', '所有设备详细信息', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>名称</th><th>产线</th><th>状态</th><th>OEE</th><th>负责人</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div>') + '</div>';
  }

  function renderInventory() {
    var rows = (state().inventory || []).map(function (item) {
      var statusText = item.qty <= item.safetyStock ? '预警' : '正常';
      return '<tr><td><input type="checkbox" class="batch-checkbox" data-id="' + e(item.id) + '"></td><td>' + e(item.code) + '</td><td>' + e(item.name) + '</td><td>' + e(item.type) + '</td><td>' + item.qty.toLocaleString() + '</td><td>' + item.safetyStock.toLocaleString() + '</td><td>' + e(item.location) + '</td><td>' + badge(statusText) + '</td></tr>';
    }).join('') || '<tr><td colspan="8"><div class="empty">暂无库存记录</div></td></tr>';

    var transactions = state().inventoryTransactions || [];
    var hasUndo = transactions.length > 0;
    var undoAction = hasUndo ? '<button class="small-btn" id="undoInventoryBtn" type="button">撤销最近一次变更</button>' : '';

    var transactionRows = transactions.length ? transactions.slice(0, 10).map(function (tx) {
      var isIn = tx.action === 'in';
      return '<tr><td>' + e(tx.time) + '</td><td>' + e(tx.name) + '</td><td>' + (isIn ? badge('入库') : badge('出库')) + '</td><td style="color:' + (isIn ? 'var(--success)' : 'var(--danger)') + ';font-weight:700">' + (isIn ? '+' : '-') + tx.qty + '</td><td>' + tx.beforeQty + '</td><td>' + tx.afterQty + '</td><td>' + e(tx.operator) + '</td></tr>';
    }).join('') : '<tr><td colspan="7"><div class="empty">暂无变更记录</div></td></tr>';

    var undoNotice = hasUndo ? '<div style="margin-top:12px;padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;font-size:13px;color:#92400e">可撤销：' + e(transactions[0].name) + ' ' + (transactions[0].action === 'in' ? '入库' : '出库') + ' ' + transactions[0].qty + ' 件（' + e(transactions[0].time) + '）</div>' : '';

    return '<div class="page-header"><div><h2>库存管理</h2><p>物料库存与出入库管理</p></div></div>' +
      twoColumn(
        sectionCard('库存列表', '当前库存状态', '<div class="table-wrap"><table><thead><tr><th><input type="checkbox" id="selectAllInventory"></th><th>编码</th><th>名称</th><th>类型</th><th>库存</th><th>安全库存</th><th>库位</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="batch-summary"><div class="batch-summary-stats"><span id="batchCountInv">已选中 0 项</span></div><div class="batch-actions"><button class="small-btn" id="batchOutInvBtn" disabled>批量出库</button></div></div>'),
        sectionCard('出入库', '物料入库与出库操作',
          '<form id="inventoryForm" class="form-grid">' +
            '<div class="field"><label>物料</label><select name="itemId">' + (state().inventory || []).map(function (inv) { return '<option value="' + inv.id + '">' + e(inv.code) + ' \u00b7 ' + e(inv.name) + '</option>'; }).join('') + '</select></div>' +
            '<div class="field"><label>动作</label><select name="action"><option value="in">入库</option><option value="out">出库</option></select></div>' +
            '<div class="field"><label>数量</label><input name="qty" type="number" min="1" value="50"></div>' +
            '<div class="field"><label>操作人</label><input name="operator" type="text" value="仓储管理员"></div>' +
            '<div class="field full"><label>备注</label><textarea name="remark" placeholder="出入库原因"></textarea></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">提交变更</button></div></form>')) +
      sectionCard('最近变更记录', '', '<div class="table-wrap"><table><thead><tr><th>时间</th><th>物料</th><th>动作</th><th>数量</th><th>变更前</th><th>变更后</th><th>操作人</th></tr></thead><tbody>' + transactionRows + '</tbody></table></div>', undoAction);
  }

  function renderPlanning() {
    var rows = (state().plans || []).map(function (p) {
      var order = getOrderById(p.orderId);
      return '<tr><td>' + e(p.id) + '</td><td>' + e(order ? order.orderNo : p.orderId) + '</td><td>' + e(p.line) + '</td><td>' + e(p.planDate) + '</td><td>' + e(p.shift) + '</td><td>' + badge(p.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="6"><div class="empty">暂无排产计划</div></td></tr>';

    return '<div class="page-header"><div><h2>计划排程</h2><p>生产计划下发与排程管理</p></div></div>' +
      twoColumn(
        sectionCard('排程列表', '当前排产计划', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>产线</th><th>日期</th><th>班次</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增排程', '下发新的生产计划',
          '<form id="planningForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>产线</label><select name="line"><option value="SMT-01">SMT-01</option><option value="ASM-02">ASM-02</option><option value="PKG-03">PKG-03</option></select></div>' +
            '<div class="field"><label>日期</label><input name="planDate" type="date" value="2026-06-14"></div>' +
            '<div class="field"><label>班次</label><select name="shift"><option value="白班">白班</option><option value="夜班">夜班</option></select></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">下发排程</button></div></form>'));
  }

  function renderWorkforce() {
    var rows = (state().teams || []).map(function (emp) {
      return '<tr><td>' + e(emp.id) + '</td><td>' + e(emp.name) + '</td><td>' + e(emp.groupName) + '</td><td>' + e(emp.role) + '</td><td>' + badge(emp.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="5"><div class="empty">暂无人员记录</div></td></tr>';

    return '<div class="page-header"><div><h2>班组管理</h2><p>人员与班组分配管理</p></div></div>' +
      twoColumn(
        sectionCard('人员列表', '在册人员信息', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>姓名</th><th>班组</th><th>岗位</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增人员', '添加新员工信息',
          '<form id="workforceForm" class="form-grid">' +
            '<div class="field"><label>姓名</label><input name="name" type="text" value="新员工"></div>' +
            '<div class="field"><label>班组</label><select name="groupName"><option value="一班组">一班组</option><option value="二班组">二班组</option><option value="质量组">质量组</option></select></div>' +
            '<div class="field"><label>岗位</label><input name="role" type="text" value="操作员"></div>' +
            '<div class="field"><label>状态</label><select name="status"><option value="在岗">在岗</option><option value="培训中">培训中</option><option value="休假">休假</option></select></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">添加人员</button></div></form>'));
  }

  function renderMaintenance() {
    var rows = (state().maintenancePlans || []).map(function (m) {
      var eq = getEquipmentById(m.equipmentId);
      return '<tr><td>' + e(m.id) + '</td><td>' + e(eq ? eq.name : m.equipmentId) + '</td><td>' + e(m.type) + '</td><td>' + e(m.planDate) + '</td><td>' + e(m.owner) + '</td><td>' + badge(m.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="6"><div class="empty">暂无保养计划</div></td></tr>';

    return '<div class="page-header"><div><h2>维护保养</h2><p>设备保养计划与执行跟踪</p></div></div>' +
      twoColumn(
        sectionCard('保养计划', '设备保养与校准计划', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>设备</th><th>类型</th><th>计划日期</th><th>负责人</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增保养计划', '制定设备保养任务',
          '<form id="maintenanceForm" class="form-grid">' +
            '<div class="field"><label>设备</label><select name="equipmentId">' + optionsFromEquipment(state().equipment[0] ? state().equipment[0].id : '') + '</select></div>' +
            '<div class="field"><label>保养类型</label><select name="type"><option value="日保养">日保养</option><option value="周保养">周保养</option><option value="校准">校准</option></select></div>' +
            '<div class="field"><label>计划日期</label><input name="planDate" type="date" value="2026-06-15"></div>' +
            '<div class="field"><label>负责人</label><input name="owner" type="text" value="黄工"></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">创建计划</button></div></form>'));
  }

  function renderAndon() {
    var rows = (state().andons || []).map(function (a) {
      return '<tr><td>' + e(a.id) + '</td><td>' + e(a.line) + '</td><td>' + e(a.type) + '</td><td>' + badge(a.status) + '</td><td>' + e(a.owner) + '</td><td>' + e(a.time) + '</td><td>' + e(a.remark) + '</td></tr>';
    }).join('') || '<tr><td colspan="7"><div class="empty">暂无异常记录</div></td></tr>';

    return '<div class="page-header"><div><h2>安灯异常</h2><p>异常呼叫与处理跟踪</p></div></div>' +
      twoColumn(
        sectionCard('异常列表', '所有安灯异常记录', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>产线</th><th>类型</th><th>状态</th><th>负责人</th><th>时间</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('发起异常', '呼叫安灯异常处理',
          '<form id="andonForm" class="form-grid">' +
            '<div class="field"><label>产线</label><select name="line"><option value="SMT-01">SMT-01</option><option value="ASM-02">ASM-02</option><option value="PKG-03">PKG-03</option></select></div>' +
            '<div class="field"><label>异常类型</label><select name="type"><option value="设备异常">设备异常</option><option value="物料短缺">物料短缺</option><option value="质量异常">质量异常</option></select></div>' +
            '<div class="field"><label>负责人</label><input name="owner" type="text" value="陈工"></div>' +
            '<div class="field full"><label>备注</label><textarea name="remark" placeholder="异常描述"></textarea></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">发起安灯</button></div></form>'));
  }

  function renderTrace() {
    var rows = (state().traceRecords || []).map(function (t) {
      var order = getOrderById(t.orderId);
      return '<tr><td>' + e(t.id) + '</td><td>' + e(t.serialNo) + '</td><td>' + e(order ? order.orderNo : t.orderId) + '</td><td>' + e(t.batchNo) + '</td><td>' + e(t.process) + '</td><td>' + badge(t.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="6"><div class="empty">暂无追溯记录</div></td></tr>';

    return '<div class="page-header"><div><h2>追溯管理</h2><p>批次追溯与序列号绑定</p></div></div>' +
      twoColumn(
        sectionCard('追溯记录', '批次追溯链查看', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>序列号</th><th>工单</th><th>批次号</th><th>工序</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增追溯', '绑定序列号与批次',
          '<form id="traceForm" class="form-grid">' +
            '<div class="field"><label>序列号</label><input name="serialNo" type="text" value="SN-20260614-001"></div>' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>批次号</label><input name="batchNo" type="text" value="LOT-20260614-A"></div>' +
            '<div class="field"><label>工序</label><select name="process"><option value="贴片">贴片</option><option value="装配">装配</option><option value="包装">包装</option></select></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存记录</button></div></form>'));
  }

  function renderDocument() {
    var rows = (state().documents || []).map(function (d) {
      var order = getOrderById(d.orderId);
      return '<tr><td>' + e(d.id) + '</td><td>' + e(order ? order.orderNo : d.orderId) + '</td><td>' + e(d.name) + '</td><td>' + e(d.version) + '</td><td>' + badge(d.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="5"><div class="empty">暂无文档记录</div></td></tr>';

    return '<div class="page-header"><div><h2>文档管理</h2><p>工艺文件与版本管理</p></div></div>' +
      twoColumn(
        sectionCard('文档列表', '工艺文件与规范文档', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>名称</th><th>版本</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('上传文档', '新增工艺文件',
          '<form id="documentForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>文档名称</label><input name="name" type="text" value="新工艺指导书"></div>' +
            '<div class="field"><label>版本号</label><input name="version" type="text" value="V1.0"></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存文档</button></div></form>'));
  }

  function renderShipping() {
    var rows = (state().shipments || []).map(function (s) {
      var order = getOrderById(s.orderId);
      return '<tr><td>' + e(s.id) + '</td><td>' + e(order ? order.orderNo : s.orderId) + '</td><td>' + e(s.customer) + '</td><td>' + e(s.carrier) + '</td><td>' + badge(s.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="5"><div class="empty">暂无发货记录</div></td></tr>';

    return '<div class="page-header"><div><h2>发货管理</h2><p>发货与物流跟踪</p></div></div>' +
      twoColumn(
        sectionCard('发货列表', '发货记录与物流状态', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>客户</th><th>物流商</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增发货', '创建发货单',
          '<form id="shippingForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>客户</label><input name="customer" type="text" value="新客户"></div>' +
            '<div class="field"><label>物流商</label><input name="carrier" type="text" value="顺丰工业物流"></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">创建发货单</button></div></form>'));
  }

  function renderStation() {
    var rows = (state().stations || []).map(function (s) {
      return '<tr><td>' + e(s.id) + '</td><td>' + e(s.code) + '</td><td>' + e(s.line) + '</td><td>' + e(s.process) + '</td><td>' + e(s.owner) + '</td><td>' + badge(s.status) + '</td></tr>';
    }).join('') || '<tr><td colspan="6"><div class="empty">暂无工位记录</div></td></tr>';

    return '<div class="page-header"><div><h2>工位管理</h2><p>工位状态与配置管理</p></div></div>' +
      twoColumn(
        sectionCard('工位列表', '产线工位状态', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>编码</th><th>产线</th><th>工序</th><th>负责人</th><th>状态</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增工位', '配置新的工位信息',
          '<form id="stationForm" class="form-grid">' +
            '<div class="field"><label>工位编码</label><input name="code" type="text" value="ST-SMT-04"></div>' +
            '<div class="field"><label>产线</label><select name="line"><option value="SMT-01">SMT-01</option><option value="ASM-02">ASM-02</option><option value="PKG-03">PKG-03</option></select></div>' +
            '<div class="field"><label>工序</label><input name="process" type="text" value="检测"></div>' +
            '<div class="field"><label>负责人</label><input name="owner" type="text" value="王工"></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存工位</button></div></form>'));
  }

  function renderSupplier() {
    var rows = (state().supplierRecords || []).map(function (s) {
      var order = getOrderById(s.orderId);
      return '<tr><td>' + e(s.id) + '</td><td>' + e(order ? order.orderNo : s.orderId) + '</td><td>' + e(s.supplier) + '</td><td>' + e(s.material) + '</td><td>' + badge(s.result) + '</td></tr>';
    }).join('') || '<tr><td colspan="5"><div class="empty">暂无供应商记录</div></td></tr>';

    return '<div class="page-header"><div><h2>供应商质量</h2><p>来料检验与供应商评价</p></div></div>' +
      twoColumn(
        sectionCard('供应商记录', '来料检验与评价', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>工单</th><th>供应商</th><th>物料</th><th>结果</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('新增记录', '登记来料检验结果',
          '<form id="supplierForm" class="form-grid">' +
            '<div class="field"><label>关联工单</label><select name="orderId">' + optionsFromOrders(state().orders[0] ? state().orders[0].id : '') + '</select></div>' +
            '<div class="field"><label>供应商</label><input name="supplier" type="text" value="新供应商"></div>' +
            '<div class="field"><label>物料名称</label><input name="material" type="text" value="新物料"></div>' +
            '<div class="field"><label>检验结果</label><select name="result"><option value="合格">合格</option><option value="待检">待检</option><option value="不合格">不合格</option></select></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存记录</button></div></form>'));
  }

  function renderEnergy() {
    var rows = (state().energyRecords || []).map(function (er) {
      return '<tr><td>' + e(er.id) + '</td><td>' + e(er.line) + '</td><td>' + e(er.shift) + '</td><td>' + er.power + ' kWh</td><td>' + er.water + ' t</td><td>' + er.carbon + ' kg</td><td>' + e(er.time) + '</td></tr>';
    }).join('') || '<tr><td colspan="7"><div class="empty">暂无能耗记录</div></td></tr>';

    return '<div class="page-header"><div><h2>能源管理</h2><p>能耗监测与统计分析</p></div></div>' +
      twoColumn(
        sectionCard('能耗记录', '产线能耗数据', '<div class="table-wrap"><table><thead><tr><th>编号</th><th>产线</th><th>班次</th><th>用电(kWh)</th><th>用水(t)</th><th>碳排放(kg)</th><th>时间</th></tr></thead><tbody>' + rows + '</tbody></table></div>'),
        sectionCard('记录能耗', '录入新的能耗数据',
          '<form id="energyForm" class="form-grid">' +
            '<div class="field"><label>产线</label><select name="line"><option value="SMT-01">SMT-01</option><option value="ASM-02">ASM-02</option><option value="PKG-03">PKG-03</option></select></div>' +
            '<div class="field"><label>班次</label><select name="shift"><option value="白班">白班</option><option value="夜班">夜班</option></select></div>' +
            '<div class="field"><label>用电(kWh)</label><input name="power" type="number" min="0" value="400"></div>' +
            '<div class="field"><label>用水(t)</label><input name="water" type="number" min="0" step="0.1" value="2.0"></div>' +
            '<div class="field"><label>碳排放(kg)</label><input name="carbon" type="number" min="0" value="220"></div>' +
            '<div class="full button-row"><button class="primary-btn" type="submit">保存记录</button></div></form>'));
  }

  function renderCurrentPage() {
    var pageRenderers = {
      dashboard: renderDashboard,
      orders: renderOrders,
      report: renderReport,
      quality: renderQuality,
      equipment: renderEquipment,
      inventory: renderInventory,
      planning: renderPlanning,
      workforce: renderWorkforce,
      maintenance: renderMaintenance,
      andon: renderAndon,
      trace: renderTrace,
      document: renderDocument,
      shipping: renderShipping,
      station: renderStation,
      supplier: renderSupplier,
      energy: renderEnergy
    };
    var fn = pageRenderers[pageKey];
    var target = document.getElementById('pageContent');
    if (!target) return;
    target.innerHTML = fn ? fn() : '<div class="empty">页面内容加载失败</div>';
    bindPageEvents();
  }

  function bindPageEvents() {
    var handlers = {
      dashboard: bindDashboardEvents,
      orders: bindOrdersEvents,
      report: bindReportEvents,
      quality: bindQualityEvents,
      equipment: bindEquipmentEvents,
      inventory: bindInventoryEvents,
      planning: bindPlanningEvents,
      workforce: bindWorkforceEvents,
      maintenance: bindMaintenanceEvents,
      andon: bindAndonEvents,
      trace: bindTraceEvents,
      document: bindDocumentEvents,
      shipping: bindShippingEvents,
      station: bindStationEvents,
      supplier: bindSupplierEvents,
      energy: bindEnergyEvents
    };
    var fn = handlers[pageKey];
    if (fn) fn();
  }

  function bindDashboardEvents() {}

  function bindOrdersEvents() {
    var form = document.getElementById('orderForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var orders = state().orders;
        var id = 'ORD-' + (1000 + orders.length + 1);
        orders.push({
          id: id, orderNo: fd.get('orderNo'), productName: fd.get('productName'),
          line: fd.get('line'), priority: fd.get('priority'), planQty: parseInt(fd.get('planQty'), 10) || 0,
          completedQty: 0, goodQty: 0, defectQty: 0, status: '待开工',
          planDate: fd.get('planDate'), remark: fd.get('remark') || '',
          progress: 0, operator: fd.get('operator'), lastUpdate: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        });
        updateState({ orders: orders });
        commit('工单已创建');
      });
    }
    var newBtn = document.getElementById('newOrderBtn');
    var cancelBtn = document.getElementById('cancelOrderBtn');
    var panel = document.getElementById('newOrderPanel');
    if (newBtn && panel) newBtn.addEventListener('click', function () { panel.style.display = 'block'; });
    if (cancelBtn && panel) cancelBtn.addEventListener('click', function () { panel.style.display = 'none'; });

    var keywordFilter = document.getElementById('keywordFilter');
    var statusFilter = document.getElementById('statusFilter');
    if (keywordFilter) keywordFilter.addEventListener('input', function () {
      updateState({ filters: Object.assign({}, state().filters, { keyword: keywordFilter.value }) });
      renderCurrentPage();
    });
    if (statusFilter) statusFilter.addEventListener('change', function () {
      updateState({ filters: Object.assign({}, state().filters, { status: statusFilter.value }) });
      renderCurrentPage();
    });

    var selectAll = document.getElementById('selectAllOrders');
    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var checkboxes = document.querySelectorAll('.batch-checkbox');
        checkboxes.forEach(function (cb) { cb.checked = selectAll.checked; });
        updateBatchCount();
      });
    }
    document.querySelectorAll('.batch-checkbox').forEach(function (cb) {
      cb.addEventListener('change', updateBatchCount);
    });
    var batchStartBtn = document.getElementById('batchStartBtn');
    var batchCompleteBtn = document.getElementById('batchCompleteBtn');
    if (batchStartBtn) batchStartBtn.addEventListener('click', function () {
      batchUpdateOrders('生产中');
    });
    if (batchCompleteBtn) batchCompleteBtn.addEventListener('click', function () {
      batchUpdateOrders('已完成');
    });
  }

  function updateBatchCount() {
    var checked = document.querySelectorAll('.batch-checkbox:checked');
    var countEl = document.getElementById('batchCount');
    var startBtn = document.getElementById('batchStartBtn');
    var completeBtn = document.getElementById('batchCompleteBtn');
    if (countEl) countEl.textContent = '已选中 ' + checked.length + ' 项';
    if (startBtn) startBtn.disabled = checked.length === 0;
    if (completeBtn) completeBtn.disabled = checked.length === 0;
  }

  function batchUpdateOrders(newStatus) {
    var checked = document.querySelectorAll('.batch-checkbox:checked');
    var ids = [];
    checked.forEach(function (cb) { ids.push(cb.getAttribute('data-id')); });
    if (ids.length === 0) return;
    var orders = state().orders;
    orders.forEach(function (o) {
      if (ids.indexOf(o.id) !== -1) {
        o.status = newStatus;
        if (newStatus === '生产中' && o.progress === 0) o.progress = 5;
      }
    });
    updateState({ orders: orders });
    commit('已批量更新 ' + ids.length + ' 个工单');
  }

  function bindReportEvents() {
    var form = document.getElementById('reportForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var reports = state().reports;
        var time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        var output = parseInt(fd.get('output'), 10) || 0;
        reports.unshift({
          id: 'R-' + (9000 + reports.length + 1), time: time,
          orderId: fd.get('orderId'), output: output,
          goodQty: parseInt(fd.get('goodQty'), 10) || 0,
          defectQty: parseInt(fd.get('defectQty'), 10) || 0,
          hours: parseFloat(fd.get('hours')) || 0,
          operator: fd.get('operator'), remark: fd.get('remark') || ''
        });
        var orderId = fd.get('orderId');
        var orders = state().orders;
        var order = orders.filter(function (o) { return o.id === orderId; })[0];
        if (order) {
          order.completedQty = (order.completedQty || 0) + output;
          order.goodQty = (order.goodQty || 0) + (parseInt(fd.get('goodQty'), 10) || 0);
          order.defectQty = (order.defectQty || 0) + (parseInt(fd.get('defectQty'), 10) || 0);
          order.progress = order.planQty > 0 ? Math.min(100, Math.round((order.completedQty / order.planQty) * 100)) : 0;
          order.status = order.progress >= 100 ? '已完成' : '生产中';
          order.lastUpdate = time;
          updateState({ orders: orders });
        }
        updateState({ reports: reports });
        commit('报工已提交');
      });
    }
  }

  function bindQualityEvents() {
    var form = document.getElementById('qualityForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var records = state().qualityRecords;
        var time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        records.unshift({
          id: 'Q-' + (7000 + records.length + 1), orderId: fd.get('orderId'),
          type: fd.get('type'), result: fd.get('result'),
          inspector: fd.get('inspector'), time: time, remark: fd.get('remark') || ''
        });
        updateState({ qualityRecords: records });
        commit('检验记录已保存');
      });
    }
  }

  function bindEquipmentEvents() {}

  function bindInventoryEvents() {
    var form = document.getElementById('inventoryForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var itemId = fd.get('itemId');
        var action = fd.get('action');
        var qty = parseInt(fd.get('qty'), 10) || 0;
        var inventory = state().inventory;
        var item = inventory.filter(function (inv) { return inv.id === itemId; })[0];
        if (!item) return;
        var beforeQty = item.qty;
        if (action === 'in') {
          item.qty += qty;
        } else {
          item.qty = Math.max(0, item.qty - qty);
        }
        var transactions = state().inventoryTransactions || [];
        var time = new Date().toLocaleString('zh-CN');
        transactions.unshift({
          time: time, name: item.name, action: action, qty: qty,
          beforeQty: beforeQty, afterQty: item.qty,
          operator: fd.get('operator'), remark: fd.get('remark') || ''
        });
        updateState({ inventory: inventory, inventoryTransactions: transactions });
        commit('库存变更已保存');
      });
    }
    var undoBtn = document.getElementById('undoInventoryBtn');
    if (undoBtn) {
      undoBtn.addEventListener('click', function () {
        var transactions = state().inventoryTransactions || [];
        if (transactions.length === 0) return;
        var last = transactions[0];
        var inventory = state().inventory;
        var item = inventory.filter(function (inv) { return inv.name === last.name; })[0];
        if (item) {
          item.qty = last.beforeQty;
        }
        transactions.shift();
        updateState({ inventory: inventory, inventoryTransactions: transactions });
        commit('已撤销最近一次变更');
      });
    }
    var selectAll = document.getElementById('selectAllInventory');
    if (selectAll) {
      selectAll.addEventListener('change', function () {
        document.querySelectorAll('.batch-checkbox').forEach(function (cb) { cb.checked = selectAll.checked; });
        updateInvBatchCount();
      });
    }
    document.querySelectorAll('.batch-checkbox').forEach(function (cb) {
      cb.addEventListener('change', updateInvBatchCount);
    });
    var batchOutBtn = document.getElementById('batchOutInvBtn');
    if (batchOutBtn) batchOutBtn.addEventListener('click', function () {
      var checked = document.querySelectorAll('.batch-checkbox:checked');
      var ids = [];
      checked.forEach(function (cb) { ids.push(cb.getAttribute('data-id')); });
      if (ids.length === 0) return;
      var inventory = state().inventory;
      inventory.forEach(function (inv) {
        if (ids.indexOf(inv.id) !== -1) inv.qty = Math.max(0, inv.qty - 10);
      });
      updateState({ inventory: inventory });
      commit('已批量出库 ' + ids.length + ' 项');
    });
  }

  function updateInvBatchCount() {
    var checked = document.querySelectorAll('.batch-checkbox:checked');
    var countEl = document.getElementById('batchCountInv');
    var outBtn = document.getElementById('batchOutInvBtn');
    if (countEl) countEl.textContent = '已选中 ' + checked.length + ' 项';
    if (outBtn) outBtn.disabled = checked.length === 0;
  }

  function bindPlanningEvents() {
    var form = document.getElementById('planningForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var plans = state().plans;
        plans.push({
          id: 'PL-' + (1000 + plans.length + 1), orderId: fd.get('orderId'),
          line: fd.get('line'), planDate: fd.get('planDate'),
          shift: fd.get('shift'), status: '已下发'
        });
        updateState({ plans: plans });
        commit('排程已下发');
      });
    }
  }

  function bindWorkforceEvents() {
    var form = document.getElementById('workforceForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var teams = state().teams;
        teams.push({
          id: 'EMP-' + String(teams.length + 1).padStart(3, '0'),
          name: fd.get('name'), groupName: fd.get('groupName'),
          role: fd.get('role'), status: fd.get('status')
        });
        updateState({ teams: teams });
        commit('人员已添加');
      });
    }
  }

  function bindMaintenanceEvents() {
    var form = document.getElementById('maintenanceForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var plans = state().maintenancePlans;
        plans.push({
          id: 'MT-' + (3000 + plans.length + 1), equipmentId: fd.get('equipmentId'),
          type: fd.get('type'), planDate: fd.get('planDate'),
          owner: fd.get('owner'), status: '待执行'
        });
        updateState({ maintenancePlans: plans });
        commit('保养计划已创建');
      });
    }
  }

  function bindAndonEvents() {
    var form = document.getElementById('andonForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var andons = state().andons;
        var time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        andons.unshift({
          id: 'AND-' + String(andons.length + 1).padStart(3, '0'),
          line: fd.get('line'), type: fd.get('type'),
          owner: fd.get('owner'), status: '待响应', time: time, remark: fd.get('remark') || ''
        });
        updateState({ andons: andons });
        commit('安灯已发起');
      });
    }
  }

  function bindTraceEvents() {
    var form = document.getElementById('traceForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var records = state().traceRecords;
        records.push({
          id: 'TR-' + String(records.length + 1).padStart(3, '0'),
          serialNo: fd.get('serialNo'), orderId: fd.get('orderId'),
          batchNo: fd.get('batchNo'), process: fd.get('process'), status: '已绑定'
        });
        updateState({ traceRecords: records });
        commit('追溯记录已保存');
      });
    }
  }

  function bindDocumentEvents() {
    var form = document.getElementById('documentForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var docs = state().documents;
        docs.push({
          id: 'DOC-' + String(docs.length + 1).padStart(3, '0'),
          orderId: fd.get('orderId'), name: fd.get('name'),
          version: fd.get('version'), status: '生效中'
        });
        updateState({ documents: docs });
        commit('文档已保存');
      });
    }
  }

  function bindShippingEvents() {
    var form = document.getElementById('shippingForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var shipments = state().shipments;
        shipments.push({
          id: 'SHIP-' + String(shipments.length + 1).padStart(3, '0'),
          orderId: fd.get('orderId'), customer: fd.get('customer'),
          carrier: fd.get('carrier'), status: '待出库'
        });
        updateState({ shipments: shipments });
        commit('发货单已创建');
      });
    }
  }

  function bindStationEvents() {
    var form = document.getElementById('stationForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var stations = state().stations;
        stations.push({
          id: 'ST-' + String(stations.length + 1).padStart(3, '0'),
          code: fd.get('code'), line: fd.get('line'),
          process: fd.get('process'), owner: fd.get('owner'), status: '待机'
        });
        updateState({ stations: stations });
        commit('工位已保存');
      });
    }
  }

  function bindSupplierEvents() {
    var form = document.getElementById('supplierForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var records = state().supplierRecords;
        records.push({
          id: 'SUP-' + String(records.length + 1).padStart(3, '0'),
          orderId: fd.get('orderId'), supplier: fd.get('supplier'),
          material: fd.get('material'), result: fd.get('result')
        });
        updateState({ supplierRecords: records });
        commit('供应商记录已保存');
      });
    }
  }

  function bindEnergyEvents() {
    var form = document.getElementById('energyForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var records = state().energyRecords;
        var time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        records.unshift({
          id: 'EN-' + String(records.length + 1).padStart(3, '0'),
          line: fd.get('line'), shift: fd.get('shift'),
          power: parseInt(fd.get('power'), 10) || 0,
          water: parseFloat(fd.get('water')) || 0,
          carbon: parseInt(fd.get('carbon'), 10) || 0,
          time: time
        });
        updateState({ energyRecords: records });
        commit('能耗记录已保存');
      });
    }
  }

  renderShell();
  renderCurrentPage();

})();