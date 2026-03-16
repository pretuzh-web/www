document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы формы
    const weightInput = document.getElementById('weight');
    const materialSelect = document.getElementById('material');
    const qualitySelect = document.getElementById('quality');
    const supportCheckbox = document.getElementById('support');
    const postprocessingCheckbox = document.getElementById('postprocessing');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Элементы для отображения результатов
    const totalPriceSpan = document.getElementById('totalPrice');
    const materialCostSpan = document.getElementById('materialCost');
    const workCostSpan = document.getElementById('workCost');
    const extraCostSpan = document.getElementById('extraCost');
    
    // Цена работы за грамм (можно настроить)
    const WORK_PRICE_PER_GRAM = 3; // 5 рублей за грамм
    
    // Функция расчета стоимости
    function calculatePrice() {
        // Получаем вес модели
        let weight = parseFloat(weightInput.value) || 0;
        
        // Получаем цену материала за кг
        const selectedMaterial = materialSelect.options[materialSelect.selectedIndex];
        const materialPricePerKg = parseFloat(selectedMaterial.dataset.price) || 300;
        
        // Получаем коэффициент качества
        const selectedQuality = qualitySelect.options[qualitySelect.selectedIndex];
        const qualityFactor = parseFloat(selectedQuality.dataset.factor) || 1;
        
        // Получаем коэффициент заполнения
        const infillRadios = document.querySelectorAll('input[name="infill"]');
        let infillFactor = 1;
        for (let radio of infillRadios) {
            if (radio.checked) {
                infillFactor = parseFloat(radio.value);
                break;
            }
        }
        
        // Расчет стоимости материала (переводим граммы в кг)
        const materialCost = (weight / 1000) * materialPricePerKg * infillFactor;
        
        // Расчет стоимости работы с учетом качества
        const workCost = weight * WORK_PRICE_PER_GRAM * qualityFactor;
        
        // Расчет дополнительных услуг
        let extraCost = 0;
        if (supportCheckbox.checked) {
            extraCost += parseFloat(supportCheckbox.value);
        }
        if (postprocessingCheckbox.checked) {
            extraCost += parseFloat(postprocessingCheckbox.value);
        }
        
        // Общая стоимость
        const totalCost = materialCost + workCost + extraCost;
        
        // Обновляем отображение
        totalPriceSpan.textContent = Math.round(totalCost);
        materialCostSpan.textContent = Math.round(materialCost);
        workCostSpan.textContent = Math.round(workCost);
        extraCostSpan.textContent = extraCost;
    }
    
    // Функция сброса всех значений
    function resetForm() {
        weightInput.value = '50';
        materialSelect.value = 'pla';
        qualitySelect.value = 'normal';
        
        // Сброс радио-кнопок
        const infillRadios = document.querySelectorAll('input[name="infill"]');
        infillRadios[0].checked = true; // 20%
        
        // Сброс чекбоксов
        supportCheckbox.checked = false;
        postprocessingCheckbox.checked = false;
        
        // Пересчитываем
        calculatePrice();
    }
    
    // Добавляем обработчики событий
    calculateBtn.addEventListener('click', calculatePrice);
    resetBtn.addEventListener('click', resetForm);
    
    // Автоматический пересчет при изменении полей (опционально)
    weightInput.addEventListener('input', calculatePrice);
    materialSelect.addEventListener('change', calculatePrice);
    qualitySelect.addEventListener('change', calculatePrice);
    
    // Обработчики для радио-кнопок
    const infillRadios = document.querySelectorAll('input[name="infill"]');
    infillRadios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
    });
    
    // Обработчики для чекбоксов
    supportCheckbox.addEventListener('change', calculatePrice);
    postprocessingCheckbox.addEventListener('change', calculatePrice);
    
    // Первоначальный расчет
    calculatePrice();
}); 